import type {
  Ingredient,
  IngredientsFixture,
  WindowWithStore,
  StoreAction,
} from '../support/types';

describe('конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients*', { fixture: 'ingredients.json' }).as('getIngredients');
  });

  it('рендеринг ингредиентов', () => {
    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.contains(/Булка светлая/i).should('exist');
    cy.contains(/Краторная котлета/i).should('exist');
  });

  it('модалка ингредиента: открытие и закрытие', () => {
    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);

    cy.contains('Соус фирменный').click();
    cy.get('[role="dialog"]').should('contain', 'Соус фирменный');

    cy.get('[role="dialog"]').first().within(() => {
      cy.get('button[aria-label="Закрыть"]').click();
    });
    cy.get('[role="dialog"]').should('not.exist');

    cy.contains('Соус фирменный').click();
    cy.get('[role="dialog"]').should('contain', 'Соус фирменный');
    cy.get('[data-cy="modal-overlay"], [class*="overlay"]').click('topLeft', { force: true });
    cy.get('[role="dialog"]').should('not.exist');

    cy.contains('Соус фирменный').click();
    cy.get('[role="dialog"]').should('exist');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('оформление заказа: номер и очистка конструктора', () => {
    cy.intercept('GET', '**/api/auth/user*', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders*', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/api/auth/token*', {
      body: { success: true, accessToken: 'Bearer test-access', refreshToken: 'test-refresh' },
    }).as('refreshToken');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh');
        win.document.cookie = 'accessToken=test-access; path=/';
      },
    });

    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);

    cy.fixture<IngredientsFixture>('ingredients.json').then(({ data }) => {
      const bun: Ingredient | undefined =
        data.find((x) => x.type === 'bun' && /тёмн/i.test(x.name)) ??
        data.find((x) => x.type === 'bun');

      const fillings: Ingredient[] = data.filter((x) => x.type !== 'bun').slice(0, 2);

      cy.window().then((w) => {
        const win = w as WindowWithStore;
        if (bun) {
          win.__store.dispatch({ type: 'constructor/setBun', payload: bun } as StoreAction);
        }
        fillings.forEach((it, idx) => {
          win.__store.dispatch({
            type: 'constructor/addIngredient',
            payload: { ...it, uuid: `e2e-${idx}` },
          } as StoreAction);
        });
      });
    });

    cy.get('[data-cy="order-button"], button')
      .contains(/оформить заказ/i)
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.wait('@createOrder').then(({ request, response }) => {
      expect(response?.body?.order?.number).to.eq(424242);
      expect(request.headers?.authorization).to.match(/^Bearer\s.+/);
    });

    cy.get('[role="dialog"]').should('contain', '424242');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');

    cy.contains(/добавьте ингредиенты|перетащите|выберите/i).should('exist');

    cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
    cy.clearCookie('accessToken');
  });
});

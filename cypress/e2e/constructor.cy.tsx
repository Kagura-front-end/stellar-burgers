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
    cy.get('[role="dialog"], [data-cy="modal"], [class*="modal"]').should('contain', 'Соус фирменный');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"], [data-cy="modal"], [class*="modal"]').should('not.exist');
  });

  it('оформление заказа: номер и очистка конструктора', () => {
    cy.intercept('GET', '**/api/auth/user*', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders*', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/api/auth/token*', {
      body: { success: true, accessToken: 'Bearer test-access', refreshToken: 'test-refresh' }
    }).as('refreshToken');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh');
        win.document.cookie = 'accessToken=test-access; path=/';
      }
    });

    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);

    cy.fixture('ingredients.json').then(({ data }) => {
      const bun =
        data.find((x: any) => x.type === 'bun' && /тёмн/i.test(x.name)) ||
        data.find((x: any) => x.type === 'bun');
      const fillings = data.filter((x: any) => x.type !== 'bun').slice(0, 2);

      cy.window().then((win) => {
        const store = (win as any).__store;
        store.dispatch({ type: 'constructor/setBun', payload: bun });
        fillings.forEach((it: any, idx: number) => {
          store.dispatch({
            type: 'constructor/addIngredient',
            payload: { ...it, uuid: `e2e-${idx}` }
          });
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

    cy.get('[role="dialog"], [data-cy="modal"], [class*="modal"]').should('contain', '424242');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"], [data-cy="modal"], [class*="modal"]').should('not.exist');

    cy.contains(/добавьте ингредиенты|перетащите|выберите/i).should('exist');

    cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
    cy.clearCookie('accessToken');
  });
});

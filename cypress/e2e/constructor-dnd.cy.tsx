import type {
  Ingredient,
  IngredientsFixture,
  WindowWithStore,
  StoreAction,
} from '../support/types';

const getNames = () =>
  cy
    .get('[data-cy="constructor-fillings"]')
    .find('[data-cy="filling-item"]')
    .should('have.length.at.least', 2)
    .then(($lis) =>
      Array.from($lis)
        .map((el) => (el as HTMLElement).innerText.replace(/\d[\s\S]*$/,'').trim())
        .filter(Boolean)
    );

describe('конструктор бургера — изменение порядка начинок', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients*', { fixture: 'ingredients.json' }).as('getIngredients');
  });

  it('reorder через action меняет порядок элементов в DOM', () => {
    cy.visit('/');
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
            payload: { ...it, uuid: `dnd-${idx}` },
          } as StoreAction);
        });
      });
    });

    getNames().then((names) => {
      expect(names).to.deep.equal(['Краторная котлета', 'Соус фирменный']);
    });

    cy.window().then((w) => {
      const win = w as WindowWithStore;
      win.__store.dispatch({
        type: 'constructor/reorderIngredient',
        payload: { fromIndex: 1, toIndex: 0 },
      } as StoreAction);
    });

    getNames().then((names) => {
      expect(names).to.deep.equal(['Соус фирменный', 'Краторная котлета']);
    });
  });
});

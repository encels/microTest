export const ROUTES = {
  POLICIES: {
    name: 'policies.title',
    children: {
      BUY_POLICY: {
        name: 'policies.buy_policy.title',
        path: '/policies',
      },
      RESTORE_POLICY: {
        name: 'policies.restore_policy.title',
      },
      CREATE_POLICY: {
        name: 'policies.create_policy.title',
        path: '/policies/create-policy',
      },
    },
  },
};

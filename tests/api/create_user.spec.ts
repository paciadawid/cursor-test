import { test, expect } from '../../test-utils/fixtures';
import { faker } from '@faker-js/faker';

test.describe('GoRest API - users', () => {
  test('should create and delete a user', async ({ gorestRequest }) => {
    test.skip(!gorestRequest, 'Set GOREST_TOKEN in the environment to run API tests');
    const api = gorestRequest!;

    const email = faker.internet.email();
    const payload = {
      name: faker.person.fullName(),
      email,
      gender: 'male' as const,
      status: 'active' as const,
    };

    let userId: number | undefined;

    try {
      const createResp = await api.post('users', { data: payload });
      expect(createResp.status()).toBe(201);

      const created = await createResp.json();
      userId = created.id;
      expect(created.email).toBe(email);

      const deleteResp = await api.delete(`users/${userId}`);
      expect(deleteResp.status()).toBe(204);
      userId = undefined;
    } finally {
      if (userId !== undefined) {
        await api.delete(`users/${userId}`).catch(() => undefined);
      }
    }
  });
});

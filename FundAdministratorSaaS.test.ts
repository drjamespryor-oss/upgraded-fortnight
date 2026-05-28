import { FundAdministratorSaaS, Pledge } from './FundAdministratorSaaS'; // Adjust path as needed

describe('FundAdministratorSaaS', () => {
  let saas: FundAdministratorSaaS;

  // Initialize a fresh instance before each test execution
  beforeEach(() => {
    saas = new FundAdministratorSaaS('admin-123', 'Acme Fund Management');
  });

  describe('Constructor Initialization', () => {
    it('should correctly initialize with public readonly properties', () => {
      expect(saas.adminId).toBe('admin-123');
      expect(saas.companyName).toBe('Acme Fund Management');
      expect(saas.transactionCount).toBe(0);
    });
  });

  describe('Merchant Level Evaluation (getMerchantLevel)', () => {
    // Helper function to simulate a batch of successful transactions
    const mockTransactions = (count: number) => {
      for (let i = 0; i < count; i++) {
        const pledge: Pledge = {
          id: `p-${i}`,
          amount: 100,
          donorName: 'Test Donor',
          status: 'pending',
        };
        saas.collectPledge(pledge);
      }
    };

    it('should return LEVEL_4 for fewer than 20,000 transactions', () => {
      mockTransactions(5);
      expect(saas.getMerchantLevel()).toBe('LEVEL_4');
    });

    it('should return LEVEL_3 on exactly the 20,000 lower bound threshold', () => {
      mockTransactions(20_000);
      expect(saas.getMerchantLevel()).toBe('LEVEL_3');
    });

    it('should return LEVEL_2 on exactly the 1,000,000 lower bound threshold', () => {
      mockTransactions(1_000_000);
      expect(saas.getMerchantLevel()).toBe('LEVEL_2');
    });

    it('should return LEVEL_1 for strictly greater than 6,000,000 transactions', () => {
      mockTransactions(6_000_001);
      expect(saas.getMerchantLevel()).toBe('LEVEL_1');
    });
  });

  describe('Pledge Collection (collectPledge)', () => {
    it('should successfully update status and increment counter when pending', () => {
      const pendingPledge: Pledge = {
        id: 'pledge-001',
        amount: 500,
        donorName: 'Alice Smith',
        status: 'pending',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      saas.collectPledge(pendingPledge);

      expect(pendingPledge.status).toBe('collected');
      expect(saas.transactionCount).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith('[Success] Collected $500 from Alice Smith');

      consoleSpy.mockRestore();
    });

    it('should throw an error and not increment counter if pledge is already collected', () => {
      const collectedPledge: Pledge = {
        id: 'pledge-002',
        amount: 250,
        donorName: 'Bob Jones',
        status: 'collected',
      };

      expect(() => saas.collectPledge(collectedPledge)).toThrow(
        "Cannot collect pledge pledge-002: status is already 'collected'"
      );
      expect(saas.transactionCount).toBe(0);
    });

    it('should throw an error and not increment counter if pledge has failed', () => {
      const failedPledge: Pledge = {
        id: 'pledge-003',
        amount: 1000,
        donorName: 'Charlie Brown',
        status: 'failed',
      };

      expect(() => saas.collectPledge(failedPledge)).toThrow(
        "Cannot collect pledge pledge-003: status is already 'failed'"
      );
      expect(saas.transactionCount).toBe(0);
    });
  });
});

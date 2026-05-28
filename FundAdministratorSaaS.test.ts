import { FundAdministratorSaaS } from './FundAdministratorSaaS';
import { PaymentGatewayService, Pledge } from './types';

describe('FundAdministratorSaaS with Mock Services', () => {
  let saas: FundAdministratorSaaS;
  let mockPaymentGateway: jest.Mocked<PaymentGatewayService>;

  beforeEach(() => {
    // 1. Create a mock instance of the external payment service
    mockPaymentGateway = {
      chargeCard: jest.fn(),
    } as unknown as jest.Mocked<PaymentGatewayService>;

    // 2. Inject the mock into your core business logic class
    saas = new FundAdministratorSaaS('admin-123', 'Acme Fund Management', mockPaymentGateway);
  });

  it('should successfully update status when payment gateway succeeds', async () => {
    const pledge: Pledge = { id: 'p1', amount: 500, donorName: 'Alice', status: 'pending' };

    // 3. Program the mock to return a simulated successful HTTP response
    mockPaymentGateway.chargeCard.mockResolvedValue({
      success: true,
      transactionId: 'tx_abc123',
    });

    await saas.collectPledge(pledge);

    expect(pledge.status).toBe('collected');
    expect(saas.transactionCount).toBe(1);
    expect(mockPaymentGateway.chargeCard).toHaveBeenCalledWith(500, 'Alice');
  });

  it('should mark pledge as failed and throw an error when payment gateway fails', async () => {
    const pledge: Pledge = { id: 'p2', amount: 100, donorName: 'Bob', status: 'pending' };

    // 4. Program the mock to return a simulated network/declined error response
    mockPaymentGateway.chargeCard.mockResolvedValue({
      success: false,
      errorMessage: 'Card declined/Insufficient funds',
    });

    await expect(saas.collectPledge(pledge)).rejects.toThrow(
      'Payment failed for pledge p2: Card declined/Insufficient funds'
    );

    expect(pledge.status).toBe('failed');
    expect(saas.transactionCount).toBe(0); // Counter should not increment
  });
});

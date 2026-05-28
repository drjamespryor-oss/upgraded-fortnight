import { PaymentGatewayService, Pledge } from './types'; // Adjust paths as needed

export class FundAdministratorSaaS {
  private totalAnnualTransactions = 0;

  // Inject the service as a dependency
  constructor(
    public readonly adminId: string,
    public readonly companyName: string,
    private paymentGateway: PaymentGatewayService, 
  ) {}

  public getMerchantLevel(): string {
    const txCount = this.totalAnnualTransactions;
    if (txCount > 6_000_000) return 'LEVEL_1';
    if (txCount >= 1_000_000) return 'LEVEL_2';
    if (txCount >= 20_000) return 'LEVEL_3';
    return 'LEVEL_4';
  }

  /**
   * Process and collect pending pledges using the payment service.
   */
  public async collectPledge(pledge: Pledge): Promise<void> {
    if (pledge.status !== 'pending') {
      throw new Error(`Cannot collect pledge ${pledge.id}: status is already '${pledge.status}'`);
    }

    // Call the external service dependency
    const response = await this.paymentGateway.chargeCard(pledge.amount, pledge.donorName);

    if (response.success) {
      pledge.status = 'collected';
      this.totalAnnualTransactions++;
    } else {
      pledge.status = 'failed';
      throw new Error(`Payment failed for pledge ${pledge.id}: ${response.errorMessage}`);
    }
  }

  public get transactionCount(): number {
    return this.totalAnnualTransactions;
  }
}

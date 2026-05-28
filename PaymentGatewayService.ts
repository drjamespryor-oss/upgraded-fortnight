export interface ChargeResponse {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

export class PaymentGatewayService {
  /**
   * Connects to a remote payment gateway API via HTTP.
   */
  public async chargeCard(amount: number, donorName: string): Promise<ChargeResponse> {
    // Real network code would live here (e.g., fetch('https://stripe.com...'))
    throw new Error('Network connection required. Do not run in unit tests.');
  }
}

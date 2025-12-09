type Props = {};

export const TermsAndConditionsPage = (props: Props) => {
  return (
    <div className="mx-auto max-w-5xl p-12">
      <h1 className="text-xl font-bold">Saas Agreement</h1>
      <p>
        While doing this onboarding you agree to a Saas contract that allows
        Whalemate Inc. hereinafter referred as the “provider” to provide for an
        indefinite period of time an anti-phishing training software to your
        employees. You are referred as the “client”
      </p>
      <h2 className="mt-8 font-bold">1. Subscription</h2>
      <p>
        The customer makes a fixed price subscription per employee using the
        educational “anti-phishing” software. The customer pays this amount
        through Stripe on a monthly basis by automatic debit from a credit card.
      </p>
      <h2 className="mt-8 font-bold">2.Term Of Payments</h2>
      <p>
        The method of payment is monthly by direct debit via credit card through
        stripe which is a technology company whose software allows individuals
        and businesses to receive payments over the internet. In the case the
        debit is not possible for any reason, the “provider” will communicate
        the “client” of the non payment situation and after that mail, the
        “client” has ten days to fix the payment situation, if not a daily 1
        percent in plus will be charged to the fee of the subscription.
      </p>
      <h2 className="mt-8 font-bold">3.Confidentiality Agreement</h2>
      <p>
        The “client” and the “provider” may not reproduce, modify, make public
        or disclose to third parties the information subject of this Agreement
        without the prior written and express authorization from the other part.
      </p>
      <h2 className="mt-8 font-bold">4. Data security</h2>
      <p>
        In order to guarantee the security of the service and of the data, "the
        PROVIDER" commits to dedicate technical resources in order to the
        respect for the integrity of the data, the protection of the
        confidentiality of the data used and stored, encryption of sensitive
        data, the availability and traceability of data, etc.
      </p>
      <h2 className="mt-8 font-bold">5. Support</h2>
      <p>
        The subscription includes support and technical assistance in case the
        anti-phishing training system fails or stops working. Without further
        ado, the representatives of "the provider" and "the client" hereby give
        their consent below. In the event that "the client" wants to suspend the
        subscription, he/she must notify "the provider" one month in advance via
        email to mrbovio@whalemate.com.
      </p>
      <h2 className="mt-8 font-bold">
        6. Mutual Indemnification under any circumstances
      </h2>
      <p>
        Each party agrees to indemnify, defend, and to hold harmless each other
        for and from any loss or liability arising out of the party’s breach of
        this contract.
      </p>
      <h2 className="mt-8 font-bold">7.Rule of Law</h2>
      <p>
        In the event of any controversy arising from the application and/or
        interpretation of this Service Legal Agreement, the “acquirer” and the
        “provider” agree to resolve the issues by amicable means, in a spirit of
        cooperation and good faith. If this is not possible, the parties submit
        to the jurisdiction and competence of the Ordinary Justice of
        California, United States of America.
      </p>
    </div>
  );
};

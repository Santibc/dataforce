export const EMAIL_CONTENT_BY_TAB = {
  pod: {
    subject: 'Coaching Feedback: Improving POD Performance',
    emailContent: `Dear [Delivery Associate's Name],
        </br></br>
        I trust this email finds you well. I wanted to take a moment to provide some coaching feedback specifically regarding your Photo on Delivery (POD) performance.
        </br></br>
        Ensuring the quality of our PODs is essential for maintaining customer satisfaction and operational efficiency. It's crucial that the photos you take meet our company standards by including the package, avoiding any individuals or animals in the picture, and ensuring clarity. Remember the best way to achieve a good picture is to place the package in the secure location, give 2 steps back and frame the package properly within the camera view.
        </br></br>
        By consistently meeting these criteria, we aim to maintain a POD rate above 99%. Your attention to detail in capturing high-quality PODs will not only benefit our customers but also contribute to the overall success of our operations.
        </br></br>
        Please review this feedback and make the necessary adjustments to enhance your POD performance. If you have any questions or need further clarification, please don't hesitate to reach out. We're here to support you in delivering exceptional service.
        </br></br>
        Thank you for your attention to this matter, and I look forward to seeing your progress in improving your POD performance.
        </br></br>
        Best regards, BOS METRICS`,
  },
  dcr: {
    subject: 'Coaching Feedback: Improving Delivery Completion Rate (DCR)',
    emailContent: `Dear [Delivery Associate's Name],
        </br></br>
        I hope this message finds you well. I wanted to provide some coaching feedback to support your improvement in our Delivery Completion Rate (DCR) metric.
        </br></br>
        Our goal is to successfully deliver every package in your route. The DCR reflects the percentage of packages delivered compared to those returned to the station. To improve your DCR, please ensure all assigned packages reach their intended destinations.
        </br></br>
        Consistently meeting this goal is crucial for maintaining customer satisfaction and optimizing our operational efficiency. Our target is to maintain a DCR above 99.5%.
        </br></br>
        Please review this feedback and make the necessary adjustments to enhance your delivery completion rate. Alway call dispatch before returning any packgaes and remember to reattemp any delieveries at the end of your route. If you have any questions or need further guidance, please don't hesitate to reach out. We're here to support you in achieving our delivery objectives.
        </br></br>
        Thank you for your attention to this matter, and I look forward to seeing your progress in improving your DCR.
        </br></br>
        Best regards, BOS METRICS`,
  },
  cc: {
    subject: 'Coaching Feedback: Improving Contact Compliance (CC)',
    emailContent: `Dear [Delivery Associate's Name],
        </br></br>
        I trust you're doing well. I wanted to provide some coaching feedback regarding our Contact Compliance (CC) metric to support your ongoing success in customer communication.
        </br></br>
        Effective communication with our customers is paramount. Before marking any package as undeliverable, please attempt to contact the customer via phone call and text message.
        </br></br>
        Maintaining 100% compliance in contacting customers before taking further action is essential for ensuring customer satisfaction and resolving delivery issues promptly.
        </br></br>
        If you are unable to deliver any package during your route, your duty is to call and/or text the customer to provide them with insight on the problems you are experiencing.
        </br></br>
        Please review this feedback and prioritize adherence to our contact compliance protocol. If you have any questions or require additional support, please feel free to reach out. We're here to assist you in delivering exceptional service to our customers.
        </br></br>
        Thank you for your attention to this matter, and I look forward to seeing your progress in improving your contact compliance.
        </br></br>
        Best regards, BOS METRICS`,
  },
  fico_score: {
    subject: 'Coaching Feedback: Enhancing FICO Score',
    emailContent: `
        You’re receiving this message because your FICO score is below our company standards. The Mentor FICO score tracks your driving behaviors while you’re working. The maximum FICO score is 850, and scores below 800 are considered below standard. Here are the infractions it monitors and tips to improve:
        </br></br>
        Seatbelt Off: Always wear your seatbelt when the van is moving.
        </br>
        Distraction: Never use your phone while driving.
        </br>
        Speeding: Stay within the posted speed limits.
        </br>
        Hard Braking: Avoid sudden braking unless it’s to prevent an accident.
        </br>
        Hard Cornering: Slow down when turning or taking curves.
        </br>
        Hard Acceleration: Don’t accelerate excessively unless avoiding a crash.
        </br></br>
        Following these guidelines will help improve your FICO score and ensure safe driving.
        </br></br>
        If you have any questions about this, contact your manager for further details.`,
  },
  cdf: {
    subject: 'Coaching Feedback: Enhancing Customer Delivery Feedback (CDF)',
    emailContent: `
        The CDF metric measures customer satisfaction with delivery, the customer can leave positive or negative reviews every time he gets a package delivered. Scores below 97% are below company standards.
        </br></br>
        Tips to Improve Your CDF Score:
        </br>
        <ol>
        <li>Verify you’re at the correct address.</li>
        <li>Check customer notes for special instructions during group stops.</li>
        <li>Follow delivery instructions if provided.</li>
        <li>If no instructions, place packages in secure, low-traffic, weather-protected locations.</li>
        <li>Don’t leave packages in lobbies, outside gates, in plain sight, in yards, or mail rooms.</li>
        <li>Never place packages in or on USPS mailboxes (illegal).</li>
        <li>Always pick the correct scan code (front door, rear door, another safe location ...)</li>
        <li>Take more and better pictures, so the customer can easily locate the delivery location.</li>
        <li>Wear your uniform, keep music low, avoid phone calls, respect customer property, and be polite.</li>
        </ol>

        If you have any questions about this, contact your manager for further details.`,
  },
  seatbelt_off_rate: {
    subject: 'Coaching Feedback: Improving Seatbelt Off Rate',
    emailContent: `
      This metric tracks how often the Netradyne camera catches you not wearing a seatbelt. You’re receiving this because you had one or more seatbelt off incidents. The goal is to have zero infractions. Follow these steps:
      </br></br>
      Before Driving:
      </br>
      Don’t start the van unless you and your passengers are wearing seatbelts.
      </br></br>
      Before Exiting:
      </br>
      Put the vehicle in Park, engage the emergency brake, turn off the vehicle, and then remove your seatbelt.
      </br></br>
      If you have questions about this metric, please contact your supervisor.`,
  },
  speeding_event_ratio: {
    subject: 'Coaching Feedback: Improving Speeding Event Rate',
    emailContent: `
      This metric tracks the number of speeding events recorded by the Netradyne camera in a week. You’re receiving this because you had one or more speeding events last week. The goal is to have zero speeding events. Follow these steps:
      <ul>
      <li>⁠The camera records a speeding event if you exceed the speed limit for 5 consecutive seconds</li>
      <li>⁠If you believe a speed limit is incorrect or there's a sudden posted speed limit change and you know the area, contact your supervisor to dispute the events.</li>
      </ul>
    
      If you have questions about this metric, please reach out to your supervisor.
       </br>
      `,
  },
} as const;

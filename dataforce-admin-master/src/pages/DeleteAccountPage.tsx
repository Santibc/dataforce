export const DeleteAccountPage = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: 80,
      marginBottom: 80,
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, padding: 20 }}>
      <div style={{ fontWeight: 'bold', fontSize: 24 }}>Delete Account / Delete Data</div>

      <div>
        At Bosmetrics, we respect your right to control your personal data. If you wish to delete
        your account and all associated data, you can do so in one of the following ways:
      </div>

      <div style={{ fontWeight: 'bold', fontSize: 18 }}>Option 1: From the App</div>

      <div>
        You can delete your account directly from the Bosmetrics mobile app by navigating to your
        Profile tab and selecting the "Delete Account" option. You will be asked to type "DELETE" to
        confirm the action. This will permanently remove your account and all associated data.
      </div>

      <div style={{ fontWeight: 'bold', fontSize: 18 }}>Option 2: By Email</div>

      <div>
        If you prefer, you can request the deletion of your account by sending an email to:
      </div>

      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: 20,
          borderRadius: 8,
          textAlign: 'center',
          fontSize: 18,
        }}
      >
        <a href="mailto:datafs.adm@gmail.com" style={{ color: '#1976d2', textDecoration: 'none' }}>
          datafs.adm@gmail.com
        </a>
      </div>

      <div>
        Please include the following information in your email:
      </div>

      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Subject: "Account Deletion Request"</li>
        <li>The email address associated with your Bosmetrics account</li>
        <li>Your full name</li>
      </ul>

      <div style={{ fontWeight: 'bold', fontSize: 18 }}>What happens when you delete your account?</div>

      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Your personal information will be permanently deleted from our systems</li>
        <li>Your account will be deactivated and you will no longer be able to log in</li>
        <li>Any subscription associated with your account will be updated accordingly</li>
      </ul>

      <div>
        We will process your request within 30 days. You will receive a confirmation email once
        your account has been successfully deleted.
      </div>

      <div style={{ fontWeight: 'bold', fontSize: 18 }}>Questions?</div>

      <div>
        If you have any questions about the account deletion process, please contact us at{' '}
        <a href="mailto:datafs.adm@gmail.com" style={{ color: '#1976d2', textDecoration: 'none' }}>
          datafs.adm@gmail.com
        </a>
        .
      </div>
    </div>
  </div>
);

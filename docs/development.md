# Development

To develop against a real Active Directory server, consider following this
[AWS guide](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_tutorial_test_lab.html).

After following the guide, testing is currently done by cloning the git branch
to the Windows Server via Remote Desktop and running the graph project on the
server.

To find the LDAP URL, run `nslookup` in PowerShell. The address should be
printed:

> Default Server: corp.example.com  
> Address: 10.0.0.126

To find the Base DN (distinguished name):

1. Open `Active Directory Users and Computers` on the Windows Server
2. Click `View` > `Advanced Features` to enable advanced features
3. Right click on root domain (ie corp.example.com)
4. Click `Attribute Editor` tab
5. Find `distinguishedName` and copy value.

To create a user:

1. Click on the User folder found in the root Organizational Unit ie -
   corp/Users
2. In the action bar, click New User
3. Provide names and a user logon name, click Next
4. Provide a password, uncheck `User must change password at next logon`

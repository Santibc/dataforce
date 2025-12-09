---
to: src/generated/<%= Name %>.tsx
---
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { APP_NAME } from 'src/config';
import { PATHS } from 'src/routes/paths';


export const <%= Name %> = ()  => {
    const { themeStretch } = useSettingsContext();
    return (
    <>
      <Helmet>
        <title> <%= Name %> | {APP_NAME}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="<%= Name %>"
          links={[
            { name: 'Root Page', href: PATHS.dashboard.adminUsers.list },
            { name: '<%= Name %>' },
          ]}
        />
        ExamplePage
      </Container>
    </>
  );
}

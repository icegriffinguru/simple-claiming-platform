import { DAPP_NAME } from 'config';
import withPageTitle from './components/PageTitle';
import Staking from './pages/Staking';

export const routeNames = {
  home: '/'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Test Project',
    component: Staking
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • ${DAPP_NAME}`
    : `${DAPP_NAME}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;

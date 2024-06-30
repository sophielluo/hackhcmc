import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ImageProvider } from './ImageContext.js';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ImageProvider> 
				<HashRouter basename="/yayhcm">
					<Switch>
						<Route path={`/auth`} component={AuthLayout} />
						<Route path={`/admin`} component={AdminLayout} />
						<Route path={`/rtl`} component={RtlLayout} />
						<Redirect from='/' to='/auth/sign-in' />
					</Switch>
				</HashRouter>
			</ImageProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);

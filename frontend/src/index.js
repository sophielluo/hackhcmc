import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { ImageProvider } from './ImageContext.js';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ImageProvider> {/* Wrap the application in ImageProvider */}
				<HashRouter>
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

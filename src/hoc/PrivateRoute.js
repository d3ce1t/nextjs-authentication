import React, { useEffect } from "react";
import Router from 'next/router'

export default function privateRoute(WrappedComponent, useSessionContext, LoginPage, loginUrl = '/login') {

    const component = function(props) {

        const context = useSessionContext();
        const { authenticated } = context.session;

        useEffect(() => {
            if (!authenticated) {
                Router.replace(Router.pathname, loginUrl, { shallow: true });
            }
        }, [authenticated]);

        return authenticated ? (
            <WrappedComponent {...props} />
        ) : (
            <LoginPage />
        );
    };
    
    if (WrappedComponent.getInitialProps) {
        component.getInitialProps = WrappedComponent.getInitialProps;
    }
    
    return component;
}

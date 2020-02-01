import React, { useEffect } from "react";
import Router from 'next/router'

export default function guestRoute(WrappedComponent, useSessionContext, HomePage, homeUrl = '/') {

    const component = function(props) {

        const context = useSessionContext();
        const { authenticated } = context.session;
        
        useEffect(() => {
            if (authenticated) {
                Router.replace(Router.pathname, homeUrl);
            }
        }, [!authenticated]);

        return !authenticated ? (
            <WrappedComponent {...props } />
        ) : (
            <HomePage />
        )
    };

    if (WrappedComponent.getInitialProps) {
        component.getInitialProps = WrappedComponent.getInitialProps;
    }

    return component;
}

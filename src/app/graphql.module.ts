import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { NgModule } from '@angular/core';

import { ENV } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';

const uri = ENV.apolloBaseURL;
export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({ uri });
  let link;
  let user: any = localStorage.getItem('pomb-user');
  if (user && user !== 'null') {
    user = JSON.parse(user);
    const middleware = setContext(() => ({
      headers: new HttpHeaders().set('Authorization', user.token ? `Bearer ${user.token}` : null)
    }));

    link = middleware.concat(http);
  } else {
    link = http;
  }
  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

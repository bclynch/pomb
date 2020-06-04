import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { setContext } from 'apollo-link-context';
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
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

import { RequestPolicy, OperationContext, createRequest } from 'urql/core';
import { pipe, subscribe } from 'wonka';
import { DocumentNode } from 'graphql';
import { observe } from 'svelte-observable';
import { getClient } from '../context';

export interface QueryArguments<Variables> {
  query: string | DocumentNode;
  variables?: Variables;
  requestPolicy?: RequestPolicy;
  pollInterval?: number;
  context?: Partial<OperationContext>;
  pause?: boolean;
}

export const query = <Variables = object>(args: QueryArguments<Variables>) => {
  const client = getClient();
  const request = createRequest(args.query, args.variables as any);

  const observable = pipe(
    client.executeQuery(request, {
      requestPolicy: args.requestPolicy,
      pollInterval: args.pollInterval,
      ...args.context,
    }),
    subscribe(arg => arg)
  );

  return observe(observable);
};

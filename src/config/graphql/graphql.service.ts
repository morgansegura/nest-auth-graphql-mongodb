import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { PubSub } from 'graphql-subscriptions';
import { join } from 'path';
import { AuthService } from '../../models/auth/auth.service';

const pubSub = new PubSub();
@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(private readonly authService: AuthService) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    const directiveResolvers = {
      isAuthenticated: (next, source, args, ctx) => {
        const { currentUser } = ctx;

        if (!currentUser) {
          throw new Error('You are not authenticated!');
        }

        return next();
      },
      hasRole: (next, source, args, ctx) => {
        const { role } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('You are not authenticated!');
        }

        if (currentUser.role !== role) {
          throw new Error(`You do not have access to perform this action!`);
        }

        return next();
      },
      hasConfirmedEmail: (next, source, args, ctx) => {
        const { isEmailConfirmed } = args;

        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('You are not authenticated!');
        }

        if (!isEmailConfirmed) {
          throw new Error('Please validate your email!');
        }

        return next();
      },
      setConfirmEmail: (next, source, args, ctx) => {
        const { isEmailConfirmed } = args;

        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('You are not authenticated!');
        }

        if (!isEmailConfirmed) {
          throw new Error('Please validate your email!');
        }

        return next();
      },
    };

    return {
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      directiveResolvers,
      context: async ({ req, res, connection }) => {
        if (connection) {
          return {
            req: connection.context,
            pubSub,
          };
        }

        let currentUser = {};

        const token = (req.headers.authorization || '').replace('Bearer ', '');

        if (token) {
          currentUser = await this.authService.findOneByToken(token);
        }

        return {
          req,
          res,
          pubSub,
          currentUser,
        };
      },
      cors: {
        credentials: true,
        origin: true,
      },
      installSubscriptionHandlers: true,
      formatError: err => {
        return err;
      },
      formatResponse: err => {
        return err;
      },
      debug: false,
      persistedQueries: {
        cache: new MemcachedCache(
          ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
          { retries: 10, retry: 10000 }, // Options
        ),
      },
      introspection: true,
      playground: {
        settings: {
          'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.fontSize': 14,
          'editor.reuseHeaders': true, // new tab reuses headers from last tab
          'editor.theme': 'dark', // possible values: 'dark', 'light'
          'general.betaUpdates': false,
          'queryPlan.hideQueryPlanResponse': false,
          'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
          'tracing.hideTracingResponse': true,
        },
      },
    };
  }
}

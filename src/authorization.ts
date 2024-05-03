import { createMongoAbility, createAliasResolver, MongoAbility, RawRuleOf, ForcedSubject } from '@casl/ability';
import type { User } from './services/users/users.schema';

// don't forget this, as `read` is used internally
const resolveAction = createAliasResolver({
  update: 'patch', // define the same rules for update & patch
  read: ['get', 'find'], // use 'read' as a equivalent for 'get' & 'find'
  delete: 'remove' // use 'delete' or 'remove'
});

export const actions = ['manage', 'create', 'read', 'update', 'delete'] as const;
export const subjects = ['users', 'accounts', 'locations', 'subscriptions', 'all'] as const;

export type Abilities = [
  typeof actions[number],
  typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];

export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility<AppAbility>(rules, { resolveAction });

export const defineAbilitiesFor = (user: User) => {
  const dynamicRules = (user.permission?.rules || []) as RawRuleOf<AppAbility>[];

  // add static rules here
  // dynamicRules.push({ action: 'read', subject: 'users' });

  return createAbility(dynamicRules);
};
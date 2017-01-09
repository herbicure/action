import getRethink from 'server/database/rethinkDriver';
import {PAYMENT_REJECTED} from 'universal/utils/constants';
import shortid from 'shortid';
import ms from 'ms';
import stripe from 'server/utils/stripe';

// run at 12am everyday
// look for customers that will expire by 12am tomorrow

export default async function billOrgs() {
  const r = getRethink();
  const now = new Date();
  const billingThreshold = new Date(now.valueOf() + ms('1d'));

  const orgsToBill = await r.table('Organization')
    .between(r.minval, billingThreshold, {index: 'validUntil'})
    .filter({isTrial: false});

  // TODO send to stripe

  // if payment failed, invalidate team & add notification
  if (paymentFailed) {
    const orgLeaderIds = await r.table('User')
      .getAll(rejectedOrgId, {index: 'orgs'})('id');
    const parentId = shortid.generate();
    const notifications = orgLeaderIds.map((userId) => {
      return {
        id: shortid.generate(),
        parentId,
        type: PAYMENT_REJECTED,
        varList: [errorMessage, last4],
        startAt: now,
        endAt: new Date(now.valueOf() + ms('10y')),
        userId,
        orgId: rejectedOrgId,
      };
    });

    // disable app usage
    await r.table('Team')
      .getAll(rejectedOrgId, {index: 'orgId'})
      .update({
        isPaid: false
      })
      // give the leaders a notification
      .do(() => {
        return r.table('Notification').insert(notifications);
      })
  }

}
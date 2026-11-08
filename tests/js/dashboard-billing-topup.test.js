import test from 'node:test';
import assert from 'node:assert/strict';
import {
    backTopup,
    continueTopup,
    createTopupState,
    resetTopup,
    selectTopupAmount,
    selectTopupMethod,
    topupAmounts,
    topupPaymentMethods,
    topupSummary,
} from '../../resources/js/dashboard-billing-topup.js';

test('all four demo payment methods can be selected', () => {
    for (const method of ['qris', 'bank', 'ewallet', 'virtual-account']) {
        assert.ok(topupPaymentMethods.includes(method));
        assert.equal(selectTopupMethod(createTopupState(), method).method, method);
    }
});

test('top-up amount and method produce an updated summary without mutating state', () => {
    const initial = createTopupState();
    const selected = selectTopupMethod(selectTopupAmount(initial, 100000), 'qris');

    assert.equal(initial.amount, 50000);
    assert.deepEqual(topupSummary(selected), { amount: 100000, method: 'qris', total: 100000 });
    assert.deepEqual(topupAmounts, [50000, 100000, 250000]);
});

test('continue requires a method and opens the matching demo instruction stage', () => {
    const noMethod = createTopupState();
    assert.equal(continueTopup(noMethod), noMethod);

    for (const method of topupPaymentMethods) {
        const state = continueTopup(selectTopupMethod(noMethod, method));
        assert.equal(state.stage, 'instructions');
        assert.equal(state.method, method);
    }
});

test('back preserves the selected method and amount; reset/cancel returns to defaults', () => {
    const instructions = continueTopup(selectTopupMethod(selectTopupAmount(createTopupState(), 250000), 'virtual-account'));
    assert.deepEqual(backTopup(instructions), { stage: 'selection', amount: 250000, method: 'virtual-account' });
    assert.deepEqual(resetTopup(), { stage: 'selection', amount: 50000, method: null });
});

test('summary never contains or changes a balance value', () => {
    const summary = topupSummary(continueTopup(selectTopupMethod(createTopupState(250000), 'ewallet')));
    assert.equal(summary.total, summary.amount);
    assert.equal('balance' in summary, false);
    assert.equal('success' in summary, false);
});

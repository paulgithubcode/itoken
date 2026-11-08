export const topupAmounts = Object.freeze([50000, 100000, 250000]);

export const topupPaymentMethods = Object.freeze(['qris', 'bank', 'ewallet', 'virtual-account']);

export function createTopupState(amount = topupAmounts[0]) {
    return {
        stage: 'selection',
        amount: topupAmounts.includes(Number(amount)) ? Number(amount) : topupAmounts[0],
        method: null,
    };
}

export function selectTopupAmount(state, amount) {
    const value = Number(amount);
    return topupAmounts.includes(value) ? { ...state, amount: value } : state;
}

export function selectTopupMethod(state, method) {
    return topupPaymentMethods.includes(method) ? { ...state, method } : state;
}

export function continueTopup(state) {
    return state.method ? { ...state, stage: 'instructions' } : state;
}

export function backTopup(state) {
    return { ...state, stage: 'selection' };
}

export function resetTopup() {
    return createTopupState();
}

export function topupSummary(state) {
    return { amount: state.amount, method: state.method, total: state.amount };
}

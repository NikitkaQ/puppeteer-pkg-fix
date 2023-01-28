async function waitForSelector(selector, opts = {}) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element && (!opts.visible && !opts.hidden || opts.visible && isElemVisible(element) || opts.hidden && !isElemVisible(element))) return resolve(element);

        const mutObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const nodes = Array.from(mutation.addedNodes);
                    for (const node of nodes) {
                        if (node.matches && node.matches(selector) && (!opts.visible && !opts.hidden || opts.visible && isElemVisible(node) || opts.hidden && !isElemVisible(node))) {
                            mutObserver.disconnect();
                            return resolve(node);
                        }
                    }
                }
                if (mutation.type === 'attributes') {
                    if (mutation.target.matches && mutation.target.matches(selector) && (!opts.visible && !opts.hidden || opts.visible && isElemVisible(mutation.target) || opts.hidden && !isElemVisible(mutation.target))) {
                        mutObserver.disconnect();
                        return resolve(mutation.target);
                    }
                }
            }
        });
        mutObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
        if (opts.timeout > 0) {
            setTimeout(() => {
                mutObserver.disconnect();
                return reject(`Timeout exceeded while waiting for selector ("${selector}").`);
            }, opts.timeout);
        }
    })
}
function isElemVisible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

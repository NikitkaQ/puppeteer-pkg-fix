function click(selector) {
    document.querySelector(selector).dispatchEvent(new MouseEvent('click', { bubbles: true, cancellable: true }));
}

setTimeout(() => {
    [...document.querySelectorAll('video')].forEach(video => {
        video.remove()
    })
}, 500)

new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.tagName === 'VIDEO') {
                    addedNode.remove()
                }
            })
        }
    });
}).observe(document.body, {
    childList: true,
    subtree: true
});

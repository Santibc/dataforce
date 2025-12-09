import autoAnimate, { getTransitionSizes } from '@formkit/auto-animate'

export const animateSlideForm = (parentElement: React.MutableRefObject<undefined>) =>
    // @ts-expect-error
    autoAnimate(parentElement.current, (el, action, oldCoords, newCoords) => {
        let keyframes
        // supply a different set of keyframes for each action
        if (action === 'add') {
            keyframes = [
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1, offset: 0.75 },
            ]
        }
        // keyframes can have as many "steps" as you prefer
        // and you can use the 'offset' key to tune the timing
        if (action === 'remove') {
            keyframes = [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0)', opacity: 0 }
            ]
        }

        // return our KeyframeEffect() and pass
        // it the chosen keyframes.
        // @ts-expect-error
        return new KeyframeEffect(el, keyframes, { duration: 300, easing: 'ease-out' })
    })
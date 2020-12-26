export function getDeltaTime(deltaTime) {
    let _deltaTime = deltaTime / 1000;
    let d = Math.floor(_deltaTime / 3600 / 24);
    let dsome = _deltaTime % (3600 * 24);
    let h = Math.floor(dsome / 3600);
    let m = Math.floor((dsome % 3600) / 60);
    let s = Math.floor((dsome % 3600) % 60);

    return {
        d,
        h,
        m,
        s,
    };
}


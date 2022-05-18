document.addEventListener('DOMContentLoaded', () => {
    const width = 21
    const grid = document.querySelector('.grid')
    const bottom = document.querySelector('.bottom')
    document.body.style.zoom = "70%"

    // grid.parentNode.style.marginLeft = ((window.innerWidth - 720) / 2).toString() + "px"

    const gList = []
    pacman = { x: 9, y: 0, direction: 'ArrowRight', points: 0, lives: 4, eaten: 0, gameStarted: false }
    intervals = {}
    directions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

    class Ghosts {
        constructor(character, nickname, x, y, direction, scared, speed) {
            this.character = character
            this.nickname = nickname
            this.x = x
            this.y = y
            this.direction = direction
            this.scared = scared
            this.speed = speed
            this.initialX = x
            this.initialY = y
        }
    }

    ghostsLst = [
        new Ghosts("SHADOW", "BLINKY", 7, 9, "ArrowLeft", false, 500),
        new Ghosts("SEEDY", "PINKY", 9, 9, "ArrowUp", false, 500),
        new Ghosts("BASHFUL", "INKY", 9, 8, "ArrowUp", false, 500),
        new Ghosts("POKEY", "CLYDE", 9, 10, "ArrowUp", false, 500)
    ]

    const legend = {
        0: "empty",
        1: "wall",
        2: "dots",
        3: "energizers",
        4: "ghost-lair",
        5: "ghost-lair-entry"
    }

    const gridMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, ],
        [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1, ],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, ],
        [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, ],
        [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, ],
        [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, ],
        [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, ],
        [1, 1, 1, 1, 2, 1, 0, 1, 1, 5, 1, 1, 0, 1, 2, 1, 1, 1, 1, ],
        [0, 0, 0, 0, 2, 0, 0, 1, 4, 4, 4, 1, 0, 0, 2, 0, 0, 0, 0, ],
        [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, ],
        [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, ],
        [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, ],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, ],
        [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, ],
        [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1, ],
        [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, ],
        [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, ],
        [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, ],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
    ]
    console.log(gridMap)

    function buildSetting() {
        gridMap.forEach(row => {
            // row.pop()
            // row.unshift()
            let t = []
            row.forEach(col => {
                // console.log(col)
                const div = document.createElement("div");
                const innerDiv = document.createElement("div");
                div.appendChild(innerDiv);
                div.classList.add(legend[col])
                grid.appendChild(div)
                t.push(div)
                if (col == 2 || col == 3) { pacman.eaten++ }

            });
            gList.push(t)
        });

        ghostsLst.forEach(g => {
            gList[g.x][g.y].classList.add(g.nickname)
            gList[g.x][g.y].classList.add("ghost")
            const div = document.createElement("div");
            const innerDiv = document.createElement("div");
            div.appendChild(innerDiv);
            div.classList.add("pacman")
            bottom.appendChild(div)
        });
        console.log(bottom)

        console.log("pacman.eaten " + pacman.eaten)
        gList[pacman.x][pacman.y].classList.add("pacman")
    }
    buildSetting();

    function movePacman(e) {

        if ((e && e.type === 'touchmove') && (xTouch || yTouch)) {
            var xUp = e.touches[0].clientX;
            var yUp = e.touches[0].clientY;
            var xDiff = xTouch - xUp;
            var yDiff = yTouch - yUp;
            if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
                if (xDiff > 0) /* left swipe */
                    pacman.direction = 'ArrowLeft';
                else if (xDiff <= 0) /* right swipe */
                    pacman.direction = 'ArrowRight';
            } else {
                if (yDiff > 0) /* up swipe */
                    pacman.direction = 'ArrowUp';
                else if (xDiff <= 0) /* down swipe */
                    pacman.direction = 'ArrowDown';
            } /* reset values */
            xTouch = null;
            yTouch = null;
        }
        switch (pacman.direction) {
            case "ArrowUp":
                if (pacman.x > 0 && !gList[pacman.x - 1][pacman.y].classList.contains("wall") && !gList[pacman.x - 1][pacman.y].classList.contains("ghost-lair") && !gList[pacman.x - 1][pacman.y].classList.contains("ghost-lair-entry")) {
                    gList[pacman.x--][pacman.y].classList.remove("pacman")
                    gList[pacman.x][pacman.y].classList.add("pacman")
                }
                break;
            case "ArrowDown":
                if (pacman.x > 0 && !gList[pacman.x + 1][pacman.y].classList.contains("wall") && !gList[pacman.x + 1][pacman.y].classList.contains("ghost-lair") && !gList[pacman.x + 1][pacman.y].classList.contains("ghost-lair-entry")) {
                    gList[pacman.x++][pacman.y].classList.remove("pacman")
                    gList[pacman.x][pacman.y].classList.add("pacman")
                }
                break;
            case "ArrowLeft":
                if (pacman.x == 9 && pacman.y == 0) {
                    gList[pacman.x][pacman.y].classList.remove("pacman")
                    pacman.y = width - 1
                }
                if (pacman.x >= 0 && !gList[pacman.x][pacman.y - 1].classList.contains("wall") && !gList[pacman.x][pacman.y - 1].classList.contains("ghost-lair") && !gList[pacman.x][pacman.y - 1].classList.contains("ghost-lair-entry")) {
                    gList[pacman.x][pacman.y--].classList.remove("pacman")
                    gList[pacman.x][pacman.y].classList.add("pacman")
                }
                break;
            case "ArrowRight":
                if (pacman.x == 9 && pacman.y == width - 1) {
                    gList[pacman.x][pacman.y].classList.remove("pacman")
                    pacman.y = 0
                }
                if (pacman.y <= width && !gList[pacman.x][pacman.y + 1].classList.contains("wall") && !gList[pacman.x][pacman.y + 1].classList.contains("ghost-lair") && !gList[pacman.x][pacman.y + 1].classList.contains("ghost-lair-entry")) {
                    gList[pacman.x][pacman.y++].classList.remove("pacman")
                    gList[pacman.x][pacman.y].classList.add("pacman")
                }
                break;
        }
    }

    function eat() {
        if (gList[pacman.x][pacman.y].classList.contains("dots")) {
            gList[pacman.x][pacman.y].classList.remove("dots")
            pacman.points += 10;
            pacman.eaten--;
        }

        if (gList[pacman.x][pacman.y].classList.contains("energizers")) {
            gList[pacman.x][pacman.y].classList.remove("energizers")
            pacman.points += 50;
            pacman.eaten--;
            ghostsLst.forEach(g => {
                g.scared = true
                gList[g.x][g.y].classList.add("scared")
            });
        }
        if (!pacman.eaten) { alert("LEVEL UP!") }

    }

    function scared(ghost) {
        if (ghost.x == pacman.x && ghost.y == pacman.y) {
            if (ghost.scared) {
                gList[pacman.x][pacman.y].classList.remove("ghost")
                gList[pacman.x][pacman.y].classList.remove("scared")
                gList[pacman.x][pacman.y].classList.remove(ghost.nickname)
                pacman.points += 200
                ghost.x = ghost.initialX
                ghost.y = ghost.initialY
            } else {
                console.log("!!!!!!!!!!")
                gList[pacman.x][pacman.y].classList.remove("pacman")
                pacman.lives--;
                bottom.removeChild(bottom.lastChild);
                pacman.x = 9
                pacman.y = 0
                pacman.gameStarted = false

                ghostsLst.forEach(ghost => {
                    gList[ghost.x][ghost.y].classList.remove("ghost")
                    gList[ghost.x][ghost.y].classList.remove("scared")
                    gList[ghost.x][ghost.y].classList.remove(ghost.nickname)
                    ghost.x = ghost.initialX
                    ghost.y = ghost.initialY

                });
                gList[pacman.x][pacman.y].classList.add("pacman")

                if (pacman.lives == 0) {
                    clearInterval(intervals["movePacman"], 500)
                    gList[pacman.x][pacman.y].classList.remove("pacman")
                    alert("Game Over!")
                }

            }
        }
    }

    function ghostMode() {
        ghostsLst.forEach(e => { if (e.scared) e.scared = false })
    }

    function moveGhosts(ghost) {
        if (pacman.gameStarted) {
            ghost.direction = directions[Math.floor(Math.random() * directions.length)]
        }
        gList[ghost.x][ghost.y].classList.remove("scared")

        pacman.gameStarted = true
        switch (ghost.direction) {
            case "ArrowUp":
                if (ghost.x > 0 && !gList[ghost.x - 1][ghost.y].classList.contains("wall") && !gList[ghost.x - 1][ghost.y].classList.contains("ghost")) {
                    gList[ghost.x][ghost.y].classList.remove("ghost")
                    gList[ghost.x--][ghost.y].classList.remove(ghost.nickname)
                    gList[ghost.x][ghost.y].classList.add("ghost")
                    gList[ghost.x][ghost.y].classList.add(ghost.nickname)
                }
                break;
            case "ArrowDown":
                if (ghost.x > 0 && !gList[ghost.x + 1][ghost.y].classList.contains("wall") && !gList[ghost.x + 1][ghost.y].classList.contains("ghost")) {
                    gList[ghost.x][ghost.y].classList.remove("ghost")
                    gList[ghost.x++][ghost.y].classList.remove(ghost.nickname)
                    gList[ghost.x][ghost.y].classList.add("ghost")
                    gList[ghost.x][ghost.y].classList.add(ghost.nickname)
                }
                break;
            case "ArrowLeft":
                console.log(ghost)
                if (ghost.x == 9 && ghost.y == 0) {
                    gList[ghost.x][ghost.y].classList.remove(ghost.nickname)
                    ghost.y = width - 1
                }
                if (ghost.x >= 0 && !gList[ghost.x][ghost.y - 1].classList.contains("wall") && !gList[ghost.x][ghost.y - 1].classList.contains("ghost")) {
                    gList[ghost.x][ghost.y].classList.remove("ghost")
                    gList[ghost.x][ghost.y--].classList.remove(ghost.nickname)
                    gList[ghost.x][ghost.y].classList.add("ghost")
                    gList[ghost.x][ghost.y].classList.add(ghost.nickname)
                }
                break;
            case "ArrowRight":
                if (ghost.x == 9 && ghost.y == width - 1) {
                    gList[ghost.x][ghost.y].classList.remove(ghost.nickname)
                    ghost.y = 0
                }
                if (ghost.y <= width && !gList[ghost.x][ghost.y + 1].classList.contains("wall") && !gList[ghost.x][ghost.y + 1].classList.contains("ghost")) {
                    gList[ghost.x][ghost.y].classList.remove("ghost")
                    gList[ghost.x][ghost.y++].classList.remove(ghost.nickname)
                    gList[ghost.x][ghost.y].classList.add("ghost")
                    gList[ghost.x][ghost.y].classList.add(ghost.nickname)
                }
                break;
        }
        if (ghost.scared) {
            console.log("^^^")
            gList[ghost.x][ghost.y].classList.add("scared")
        }
    }

    function touchStarted(e) {
        const initialTouch = (e.touches || e.originalEvent.touches)[0];
        xTouch = initialTouch.clientX;
        yTouch = initialTouch.clientY;
    };

    document.addEventListener('touchstart', touchStarted, false);
    document.addEventListener('touchmove', movePacman, false);

    window.addEventListener('load', () => {
        intervals["movePacman"] = setInterval(movePacman, 500)
        intervals["eat"] = setInterval(eat, 500)
        intervals["ghostMode"] = setInterval(ghostMode, 25600)

        ghostsLst.forEach(g => {
            intervals["moveGhosts"] = setInterval(() => { moveGhosts(g) }, 500)
            intervals["scared"] = setInterval(() => { scared(g) }, 500)
        });
    })
    document.addEventListener('keyup', (e) => { pacman.direction = e.code })
    document.getElementById("moveup").addEventListener('click', (e) => { pacman.direction = "ArrowUp" })
    document.getElementById("movedown").addEventListener('click', (e) => { pacman.direction = "ArrowDown" })
    document.getElementById("moveleft").addEventListener('click', (e) => { pacman.direction = "ArrowLeft" })
    document.getElementById("moveright").addEventListener('click', (e) => { pacman.direction = "ArrowRight" })

})
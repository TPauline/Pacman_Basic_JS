document.addEventListener('DOMContentLoaded', () => {
    const width = 21
    const height = 21
    const grid = document.querySelector('.grid')
    const gList = []
    pacman = { x: 9, y: 0, direction: 'ArrowRight', points: 0, lives: 3 }
    ghostsLst = []
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
        }
    }

    ghostsLst.push(new Ghosts("SHADOW", "BLINKY", 7, 10, "ArrowLeft", false, 500))
    ghostsLst.push(new Ghosts("SEEDY", "PINKY", 9, 10, "ArrowUp", false, 500))
    ghostsLst.push(new Ghosts("BASHFUL", "INKY", 9, 9, "ArrowUp", false, 500))
    ghostsLst.push(new Ghosts("POKEY", "CLYDE", 9, 11, "ArrowUp", false, 500))


    const legend = {
        0: "empty",
        1: "wall",
        2: "dots",
        3: "energizers",
        4: "ghost-lair",
        5: "ghost-lair-entry"
    }

    const gridMap = [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0],
        [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 5, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 2, 0, 0, 1, 4, 4, 4, 1, 0, 0, 2, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 0],
        [0, 1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1, 0],
        [0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0],
        [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ]
    console.log(gridMap)

    function buildSetting() {
        gridMap.forEach(row => {
            let t = []
            row.forEach(col => {
                // console.log(col)
                const div = document.createElement("div");
                const innerDiv = document.createElement("div");
                div.appendChild(innerDiv);
                div.classList.add(legend[col])
                grid.appendChild(div)
                t.push(div)
            });
            gList.push(t)
        });

        ghostsLst.forEach(g => {
            gList[g.x][g.y].classList.add(g.nickname)
            gList[g.x][g.y].classList.add("ghost")

        });
    }
    buildSetting();

    gList[pacman.x][pacman.y].classList.add("pacman")

    function movePacman(e) {
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
        }

        if (gList[pacman.x][pacman.y].classList.contains("energizers")) {
            gList[pacman.x][pacman.y].classList.remove("energizers")
            pacman.points += 50;
        }
    }

    function moveGhosts(ghost) {
        ghost.direction = directions[Math.floor(Math.random() * directions.length)]
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
    }


    window.addEventListener('load', () => {
        setInterval(movePacman, 500)
        setInterval(eat, 50)
        ghostsLst.forEach(g => setInterval(() => { moveGhosts(g) }, 500));
    })

    document.addEventListener('keyup', (e) => { pacman.direction = e.code })

})
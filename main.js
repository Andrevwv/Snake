let playgroundSize = 50
let speed = 200



class Game {
    constructor() {
        this.playground = new Playground(playgroundSize)
        this.snake = new Snake(this.playground)
        this.pointsElement = document.querySelector('.points__count')
    }
    start() {
        document.removeEventListener('keydown', spaceEventHandler)
        document.querySelector('.playground__play').style.visibility = 'hidden'
        this.snake.initiate()
        this.playground.setFrogToRandomPosition()
        this.refresh()
    }

    stop() {
        clearInterval(this.snakeMoveInterval)
        this.snake.reset()
        this.playground.reset()
        this.snake = new Snake(this.playground)
        document.querySelector('.playground__play').style.visibility = 'visible'
        document.addEventListener('keydown', spaceEventHandler)
    }

    refresh() {
        this.snakeMoveInterval = setInterval(() => {
            if (this.snake.checkMovePossibility()) {
                this.snake.move()
                this.refreshPointsCount()
            } else {
                this.stop()
            }
        }, speed)
    }

    refreshPointsCount() {
        this.pointsElement.textContent = this.snake.eatenFrogsCount * 100
    }
}

class Playground {
    constructor(size) {
        this.size = size
        this.playground
        this.frog
        this.initialize()
        // this.setFrogToRandomPosition()
    }

    initialize() {
        this.playground = new Array(this.size)
        let fragment = document.createDocumentFragment()
        let playgroundElement = document.querySelector('.playground')

        for (let column = 0; column < this.playground.length; column++) {
            let newArray = new Array(this.size).fill(false)
            this.playground[column] = newArray
            let columnElement = document.createElement('div')
            columnElement.classList.add('column')
            for (let columnItem = 0; columnItem < this.playground.length; columnItem++) {
                let columnItemElement = document.createElement('div')
                columnItemElement.classList.add(`column-item-${column}-${columnItem}`)
                columnElement.appendChild(columnItemElement)
            }
            fragment.appendChild(columnElement)
        }
        playgroundElement.appendChild(fragment)
    }

    enableSegment(x, y) {
        if (this.playground[x]) this.playground[x][y] = true

        let currentSegmentElement = document.querySelector(`.column-item-${x}-${y}`)

        if (currentSegmentElement) {
            currentSegmentElement.classList.add('column-item--active')
        }

        if (this.frog && !this.frog.alive) {
            this.setFrogToRandomPosition()
        }
    }

    disableSegment(x, y) {
        if (this.playground[x]) this.playground[x][y] = false

        let currentSegmentElement = document.querySelector(`.column-item-${x}-${y}`)

        if (currentSegmentElement) {
            currentSegmentElement.classList.remove('column-item--active')
        }
    }

    setFrogToRandomPosition() {
        let randomX = Math.floor(Math.random() * this.playground.length)
        let randomY = Math.floor(Math.random() * this.playground.length)
        // this.playground[randomX][randomY] = this.frog
        // this.enableSegment(randomX, randomY)
        // need refactoring
        // copy paste
        this.frog = new Frog(randomX, randomY)
        if (this.playground[randomX]) this.playground[randomX][randomY] = this.frog

        let currentSegmentElement = document.querySelector(`.column-item-${randomX}-${randomY}`)

        if (currentSegmentElement) {
            currentSegmentElement.classList.add('column-item--active')
        }
        // need refactoring
    }

    reset() {
        this.playground[this.frog.position.x][this.frog.position.y] = false
        this.disableSegment(this.frog.position.x, this.frog.position.y)
        this.frog = null
    }
}

class Frog {
    constructor(xPosition, yPosition) {
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.alive = true
    }
}

class snakeSection {
    constructor(xPosition, yPosition, previous, next) {
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.previous = previous
        this.next = next
    }

    hasPrevious() {
        return this.previous ? true : false
    }

    hasNext() {
        return this.next ? true : false
    }
}

class Snake {
    constructor(playground) {
        this.playground = playground
        this.eatenFrogsCount = 0
        this.isMovePerformed = false
        this.head
        this.tail
    }

    currentDirection = 'ArrowUp'

    directions = {
        ArrowUp: {
            deltaX: 0,
            deltaY: -1
        },
        ArrowDown: {
            deltaX: 0,
            deltaY: 1
        },
        ArrowLeft: {
            deltaX: -1,
            deltaY: 0
        },
        ArrowRight: {
            deltaX: 1,
            deltaY: 0
        }
    }

    initiate() {
        this.head = new snakeSection(Math.floor(this.playground.size / 2), Math.floor(this.playground.size / 2))
        this.tail = new snakeSection(Math.floor(this.playground.size / 2) - 1, Math.floor(this.playground.size / 2))
        this.head.previous = this.tail
        this.tail.next = this.head
        this.playground.enableSegment(this.head.position.x, this.head.position.y)
        this.playground.enableSegment(this.tail.position.x, this.tail.position.y)
        document.addEventListener('keydown', this.changeDirection)
    }

    add() {
        let direction = this.directions[this.currentDirection]
        let newSnakeSection = new snakeSection(this.head.position.x + direction.deltaX, this.head.position.y + direction.deltaY)
        newSnakeSection.previous = this.head
        this.head.next = newSnakeSection
        this.head = newSnakeSection

        this.playground.enableSegment(newSnakeSection.position.x, newSnakeSection.position.y)
    }

    remove() {
        this.tail.next.previous = null
        this.playground.disableSegment(this.tail.position.x, this.tail.position.y)
        this.tail = this.tail.next
    }

    changeDirection = (event) => {
        if (this.isMovePerformed) {
            if (event.code === 'ArrowUp' && this.currentDirection !== 'ArrowDown') {
                this.currentDirection = event.code
                this.isMovePerformed = false
            }
            else if (event.code === 'ArrowDown' && this.currentDirection !== 'ArrowUp') {
                this.currentDirection = event.code
                this.isMovePerformed = false
            }
            else if (event.code === 'ArrowLeft' && this.currentDirection !== 'ArrowRight') {
                this.currentDirection = event.code
                this.isMovePerformed = false
            }
            else if (event.code === 'ArrowRight' && this.currentDirection !== 'ArrowLeft') {
                this.currentDirection = event.code
                this.isMovePerformed = false
            }
        }
    }

    move() {
        let direction = this.directions[this.currentDirection]
        let nextMoveValue = this.playground.playground[this.head.position.x + direction.deltaX][this.head.position.y + direction.deltaY]
        if (nextMoveValue && (nextMoveValue instanceof Frog)) {
            this.eatenFrogsCount++
            console.log(this.eatenFrogsCount)
            nextMoveValue.alive = false
            this.add(this.directions[this.currentDirection])
        }

        this.add(this.directions[this.currentDirection])
        this.remove()

        this.isMovePerformed = true
    }

    checkMovePossibility() {
        let direction = this.directions[this.currentDirection]
        let nextHeadPositionX = this.head.position.x + direction.deltaX
        let nextHeadPositionY = this.head.position.y + direction.deltaY
        let isLeftBorderTouched = nextHeadPositionX < 0
        let isTopBorderTouched = nextHeadPositionY < 0
        let isBottomBorderTouched = nextHeadPositionY >= playgroundSize
        let isRightBorderTouched = nextHeadPositionX >= playgroundSize
        let isSnakeSectionTouched
        try {
            isSnakeSectionTouched = this.playground.playground[nextHeadPositionX][nextHeadPositionY] === true
        } catch (e) {
            // exeption handling
        }
        return !(isTopBorderTouched || isLeftBorderTouched || isRightBorderTouched || isBottomBorderTouched || isSnakeSectionTouched)
    }

    reset() {
        while (this.head.hasPrevious()) {
            this.remove()
        }
        this.playground.disableSegment(this.tail.position.x, this.tail.position.y)
        try {
            this.playground[this.head.position.x][this.head.position.y] = false
        } catch (e) {
            // exeption handling
        }
        this.head = null
        this.tail = null
        document.removeEventListener('keydown', this.changeDirection)
    }
}

let game = new Game()

function spaceEventHandler(evt) {
    if (evt.code === 'Space') {
        game.start()
    }
}

window.onload = function () {
    document.addEventListener('keydown', spaceEventHandler)
}
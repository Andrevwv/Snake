let playgroundSize = 50
let gameSpeed = 200

class Game {
    constructor(speed) {
        this.speed = speed
        this.playground = new Playground(playgroundSize)
        this.snake = new Snake(this.playground)
        this.countOfFrogsToIncreaseSpeed = 5
        this.isPosibleToincreseSpeed = true
        this.bonusesPriseForOneFrog = 100
        this.pointsElement = document.querySelector('.points__count')
        document.addEventListener('keydown', this.spaceEventHandler)
    }
    start() {
        document.removeEventListener('keydown', this.spaceEventHandler)
        document.querySelector('.playground__play').style.visibility = 'hidden'
        this.snake.initiate()
        this.refresh()
    }

    stop() {
        clearInterval(this.snakeMoveInterval)
        this.snake.reset()
        this.playground.reset()
        this.snake = new Snake(this.playground)
        document.querySelector('.playground__play').style.visibility = 'visible'
        document.addEventListener('keydown', this.spaceEventHandler)
    }

    refresh() {
        this.snakeMoveInterval = setInterval(() => {
            if (this.snake.checkMovePossibility()) {
                this.snake.move()
                this.refreshPointsCount()

                let isEatenIncreasingSpeadFrog = this.snake.eatenFrogsCount % this.countOfFrogsToIncreaseSpeed === 0

                if (this.isPosibleToincreseSpeed && this.snake.eatenFrogsCount && isEatenIncreasingSpeadFrog) {
                    this.incresePlaySpeed()
                }
            } else {
                this.stop()
            }
        }, this.speed)
    }

    refreshPointsCount() {
        this.pointsElement.textContent = this.snake.eatenFrogsCount * this.bonusesPriseForOneFrog
    }

    incresePlaySpeed() {
        this.isPosibleToincreseSpeed = false
        this.speed = this.speed - (this.speed * 0.2)
        clearInterval(this.snakeMoveInterval)
        this.refresh()
    }

    spaceEventHandler = (evt) => {
        if (evt.code === 'Space') {
            this.start()
        }
    }
}

class Playground {
    constructor(size) {
        this.size = size
        this.playground
        this.frog
        this.initialize()
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

    enableSegment(x, y, valueToSet) {
        if (this.playground[x]) this.playground[x][y] = valueToSet

        let currentSegmentElement = document.querySelector(`.column-item-${x}-${y}`)

        if (currentSegmentElement) {
            currentSegmentElement.classList.add('column-item--active')
        }

        if (!this.frog) {
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

        this.frog = new Frog(randomX, randomY)
        this.enableSegment(randomX, randomY, this.frog)
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
        this.tail = new snakeSection(Math.floor(this.playground.size / 2), Math.floor(this.playground.size / 2) + 1)
        this.head.previous = this.tail
        this.tail.next = this.head
        this.playground.enableSegment(this.head.position.x, this.head.position.y)
        this.playground.enableSegment(this.tail.position.x, this.tail.position.y)
        document.addEventListener('keydown', this.changeDirection)
    }

    add() {
        let newSnakeSection = new snakeSection(this.nextHeadPositionX(), this.nextHeadPositionY())
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
        let nextMoveValue = this.playground.playground[this.nextHeadPositionX()][this.nextHeadPositionY()]
        if (nextMoveValue && (nextMoveValue instanceof Frog)) {
            this.eatFrog()
        }

        this.add()
        this.remove()

        this.isMovePerformed = true
    }

    eatFrog() {
        this.eatenFrogsCount++
        this.playground.frog = false
        this.add()
        this.playground.isPosibleToincreseSpeed = true
    }

    nextHeadPositionX() {
        return this.head.position.x + this.directions[this.currentDirection].deltaX
    }

    nextHeadPositionY() {
        return this.head.position.y + this.directions[this.currentDirection].deltaY
    }

    checkMovePossibility() {
        let isLeftBorderTouched = this.nextHeadPositionX() < 0
        let isTopBorderTouched = this.nextHeadPositionY() < 0
        let isBottomBorderTouched = this.nextHeadPositionY() >= playgroundSize
        let isRightBorderTouched = this.nextHeadPositionX() >= playgroundSize
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

window.onload = function () {
    new Game(gameSpeed)
}
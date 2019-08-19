let playgroundSize = 50
let speed = 500
// let playground = new Array(playgroundBorder)
function start () {
    let playground = new Playground(playgroundSize)
    let snake = new Snake(playground)
    document.addEventListener('keydown', function(e) {
        snake.changeDirection(e.key)
    })
    snake.add( {
        deltaX: 0,
        deltaY: -1 
    })
    snake.add( {
        deltaX: 0,
        deltaY: -1 
    })
    snake.add( {
        deltaX: 0,
        deltaY: -1 
    })
    setInterval(function() {
        snake.move()
    }, speed)
}

// function moveRight () {
//     playground
// }

class Playground {
    constructor(size) {
        this.size = size
        this.initialize()
    }
    
    initialize () {
        this.playground = new Array(this.size)
        let fragment = document.createDocumentFragment()
        let playgroundElement = document.querySelector('.playground')
        this.playground.fill(new Array(this.size, false))
        for (let column = 0; column < this.playground.length; column++) {
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

    enableSegment (x, y) {
        this.playground[x][y] = true
        document.querySelector(`.column-item-${x}-${y}`).classList.add('column-item--active')
    } 
    
    disableSegment (x, y) {
        this.playground[x][y] = false
        document.querySelector(`.column-item-${x}-${y}`).classList.remove('column-item--active')
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

    hasPrevious () {
        return this.previous ? true : false
    }

    hasNext () {
        return this.next ? true : false
    }
}

class Snake {
    constructor(playground) {
        this.playground = playground
        this.head = new snakeSection(Math.floor(playground.size/2), Math.floor(playground.size/2))
        this.tail = new snakeSection(Math.floor(playground.size/2)-1, Math.floor(playground.size/2))
        this.head.previous = this.tail
        this.tail.next = this.head

        this.playground.enableSegment(this.head.position.x, this.head.position.y)
        this.playground.enableSegment(this.tail.position.x, this.tail.position.y)
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
    add (direction) {
        let topAndLeftBorder = this.head.position.x + direction.deltaX < 0 || this.head.position.y + direction.deltaY < 0
        let rightAndBottomBorder = this.head.position.x + direction.deltaX >= playgroundSize || this.head.position.y + direction.deltaY >= playgroundSize
        // let snakePosition = this.playground[this.head.position.x + direction.deltaX][this.head.position.y + direction.deltaY]
        if (topAndLeftBorder || rightAndBottomBorder) {
            console.log('endgame')
        } else {
            let newSnakeSection = new snakeSection(this.head.position.x + direction.deltaX, this.head.position.y + direction.deltaY)
            newSnakeSection.previous = this.head
            this.head.next = newSnakeSection
            this.head = newSnakeSection
            
            this.playground.enableSegment(newSnakeSection.position.x, newSnakeSection.position.y)
        }
    }

    remove() {
        this.tail.next.previous = null
        this.playground.disableSegment(this.tail.position.x, this.tail.position.y)
        this.tail = this.tail.next
    }

    changeDirection (code) {
        if (code === 'ArrowUp' && this.currentDirection !== 'ArrowDown') {
            this.currentDirection = code
        }
        else if (code === 'ArrowDown' && this.currentDirection !== 'ArrowUp') {
            this.currentDirection = code
        }
        else if (code === 'ArrowLeft' && this.currentDirection !== 'ArrowRight') {
            this.currentDirection = code
        }
        else if (code === 'ArrowRight' && this.currentDirection !== 'ArrowLeft') {
            this.currentDirection = code
        }
    }

    move () {
        this.add(this.directions[this.currentDirection])
        this.remove()
        // if () {

        // }
    }

    // checkMovePossibility () {
    //     this.playground[this.head.position.x][this.head.position.y] != 
    // }
}
 
window.onload = function() {
    start()
}
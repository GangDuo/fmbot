function multipleOf(n, count) {
  return sequence(n, count, n)
}

function sequence(begin, count, step) {
  const difference = step || 1
  return [...Array(count).keys()]
    .map(i => begin + i * difference)
}

function progress(maxValue, currentValue) {
    const percentage = Math.floor(100 * currentValue / maxValue)
    const bar = multipleOf(5, 20).reduce((ax, n) => {
      ax += n <= percentage ? '=' : ' '
      return ax
    }, '[') + ']' + percentage + '%'
    process.stdout.write("\r" + bar)
    if(percentage === 100) {
      process.stdout.write("\nfinish\n\n")
    }
}

exports.progress = progress

const {FmClient, Points} = require('fmww-library');
const readline = require('readline');

module.exports = class PointsController {
  static search(options) {
    console.log('PointsController.search')
  }

  static async create(options) {
    const c = new FmClient()
    await c
      .open(process.env.FMWW_SIGN_IN_URL)
      .signIn({
        FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
        FMWW_USER_NAME         : process.env.FMWW_USER_NAME,
        FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
        FMWW_PASSWORD          : process.env.FMWW_PASSWORD
      })
      .createAbility(Points)

    try {
      if(options.membershipNumber &&
         options.storeCode &&
         options.points) {
        const response = await create(c, options)
        console.log(response.isSuccess ? 'Success' : response.statusText)
        return
      }
      console.log('Read from stdin...')
      const getLine = useReadLine()
      for (;;) {
        const line = await getLine()
        if(!line) {
          return;
        }
        const values = line.split(',')
        const response = await create(c, {
          membershipNumber: values[0],
          storeCode: values[1],
          owner: options.owner,
          points: values[2]
        })
        console.log(`${line}: ` + (response.isSuccess ? 'Success' : response.statusText))
      };
    } catch(e) {
    } finally {
      await c.quit()
    }
  }
}

async function create(client, options) {
  const response = await client
    .create({
      membershipNumber: options.membershipNumber,
      storeCode: options.storeCode,
      owner: options.owner,
      points: options.points,
      grounds: '04'
    })
  return response
}

function useReadLine() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  const getLineGen = (async function* () {
    for await (const line of rl) {
      yield line;
    }
  })();
  return async () => ((await getLineGen.next()).value);
}

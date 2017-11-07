module.exports = options => {

  const {hostname} = options

  return ({
    title: 'Image Search Abstraction',
    instructions: [
      {
        text: 'Pass a URL as a parameter to the URL ',
        url: `${hostname}/imagesearch/<query>[?offset=value]`
      },
      {
        text: 'View recent search queries using the URL ',
        url: `${hostname}/latest/`
      }
    ],
    exampleinput: [
      `${hostname}/imagesearch/puppies?offset=4`,
      `${hostname}/latest/`
    ],
    exampleoutput: [
      JSON.stringify(
        {
          type: "image/jpeg",
          width: 480,
          height: 360,
          size: 19463,
          url: "https://i.ytimg.com/vi/mRf3-JkwqfU/hqdefault.jpg",
          thumbnail: {
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQihVZOhZZ73-ePag8fgdTAV-8Gf-9xchf2e8BrgfBCGySVDfxe_rkFkyZX",
            width: 129,
            height: 97
          },
          description: "Funny Puppies And Cute Puppy Videos Compilation 2016 [BEST OF ...",
          parentPage: "https://www.youtube.com/watch?v=mRf3-JkwqfU"
        }, null, 2),
      JSON.stringify(
        {
          term: "puppies",
          when: new Date().toISOString()
        }, null, 2
      )
    ],
    error: {
      message: null,
      description: null
    }
  })
}
//getTopics function
//getLinks function
//appendTopics function
//appendLinks to topics function
//run all of the above in onLoad function



$('#add-btn-div').on('click', () => {
  //POST new topic to the server
  let newTopic = $('#topic-input').val();

  $.post('/api/v1/topics/', { name: newTopic }, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendTopic(newTopic, res.id)
    } else if (resObj.status === 422) {
      //function needed to toggle on display error message
      alert('invalid entry')
    }
  })
    .catch(error => console.log(error))

})

$('#content-container').on('click', '.link-add-btn', function() {
  //using es5 because es6 changes scope of 'this'.. how to use es6?
  //POST a new link to the specific topic
  //will need variable for topic id that will be used as query parameter
  let linkTitle = $(this).siblings('.title-input').val();
  let longLink = $(this).siblings('.url-input').val();
  let topicId = $(this).attr('id');
  console.log(topicId);
  // let topicId = $(this).parents('.card-body-initial').siblings('.topic-title').children('h3').text();
  let bodyObj = {
    link_title: linkTitle,
    long_link: longLink,
    short_link: 'shorty',
    click_count: 0,
    topic_id: topicId
  };

  $.post('/api/v1/links/', bodyObj, (res,text,resObj) => {
    if (resObj.status === 201) {
      appendLink(linkTitle, 'shortLink', this)
    } else if (resp.status === 422) {
      alert('invalid link entry')
    }
  })
  .catch(error => console.log(error))

})

$('#content-container').on('click', '.topic-title', function(e) {
  let cardBody = $(this).siblings('.card-body-initial')

  cardBody.toggleClass('card-body-hide')
})

function appendLink(newTitle, shortLink, thisLocale) {
  let linksContainer = $(thisLocale).closest('.form-sort-container').siblings('.links-container');

  linksContainer.append(
    //need to revisit how we structuring the links....later
    `<div>
      <h4>${newTitle}</h4>
      <h4>${shortLink}</h4>
    </div>`
  )
}

const appendTopic = (newTopicText, id) => {
  $('#content-container').append(
    `<article class='topic-card'>
      <header class='topic-title'>
        <h3 class='topic-text'>${newTopicText}</h3>
        <h3 class='link-qty'>qty</h3>
      </header>
      <section class='card-body-initial'>
        <div class='form-sort-container'>
          <div class='add-form'>
            <label class='title-label'>Title</label>
            <input class='title-input'>
            <label class='url-label'>Url</label>
            <input class='url-input'>
            <button id=${id} class='link-add-btn'>Add</button>
          </div>
          <div class='sort-options'>
            <h3>Sort</h3>
            <div class='radio-buttons'>
              <label>Recently Added<input type='radio' name='sort'></label>
              <label>Most Popular <input type='radio' name='sort'></label>
            </div>
          </div>
        </div>
        <div class='links-container'></div>
      </section>
    </article>`)
}

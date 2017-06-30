
getContent()

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

  let linkTitle = $(this).siblings('.form-container').find('.title-input').val();
  let longLink = $(this).siblings('.form-container').find('.url-input').val();
  let shortLink = createShortUrl();
  let topicId = $(this).attr('id');
  let bodyObj = {
    link_title: linkTitle,
    long_link: longLink,
    short_link: shortLink,
    click_count: 0,
    topic_id: topicId
  };

  $.post('/api/v1/links/', bodyObj, (res, text, resObj) => {
    if (resObj.status === 201) {
      appendLink(linkTitle, bodyObj.short_link, bodyObj.click_count, this)
    } else if (resp.status === 422) {
      alert('invalid link entry')
    }
  })
  .catch(error => console.log(error))
});

$('#content-container').on('click', '.topic-title', function() {
  let cardBody = $(this).siblings('.card-body')

  cardBody.toggleClass('card-body-hide')
});


$('#content-container').on('click', '.link-url', function() {
  const shortLinkText = $(this).find('a')[0].innerText;

  $.get('/api/v1/links')
    .then(links => {
      const clickedLinkObj = links.find(linkObj => linkObj.short_link === shortLinkText);
      return clickedLinkObj.click_count;
    })
    .then( clickCount => {
      console.log(clickCount);
      $.ajax({
        method: 'PUT',
        url: '/api/v1/links/clickCountIncr',
        data: {shortLinkText, clickCount },
        success: result => {
          console.log(result.response);
        }
      })
    })

});

$('#content-container').on('click', '.radio-btn', function() {
  const topicId = $(this).attr('id');
  const sortType = $(this).attr('value');
  const linksContainer = $(this).closest('.form-sort-container').siblings('.links-container');
  const linkAddButton = $(`button[id='${topicId}']`)

  $.get(`/api/v1/topics/${topicId}/links`)
    .then(links => sortLinks(links, linksContainer, linkAddButton, sortType))
    .catch(error => console.log(error));

});

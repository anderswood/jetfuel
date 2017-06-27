
$('#topic-add-btn').on('click', () => {
  let newTopic = $('#topic-input').val()
  appendTopic(newTopic)
})

$('#content-container').on('click', '.link-add-btn', function() {
  //using es5 because es6 changes scope of 'this'.. how to use es6?
  let title = $(this).siblings('.title-input').val()
  let url = $(this).siblings('.url-input').val()
  appendLink(title, url, this)
  console.log(this);
})

function appendLink(newTitle, newUrl, thisLocale) {
  let linksContainer = $(thisLocale).closest('.form-sort-container').siblings('.links-container')[0];
  console.log(linksContainer);
  linksContainer.append(
    `<h4>${newTitle}</h4>
    <h4>${newUrl}</h4>`
  )
}

const appendTopic = (newTopicText) => {
  $('#content-container').append(
    `
    <article class='topic-card'>
      <header>
        <h3>${newTopicText}</h3>
        <div>
          <h4>qty</h4>
          <h4>expand</h4>
        </div>
      </header>
      <section class='card-body'>
        <div class='form-sort-container'>
          <div class='add-form'>
            <label class='title-label'>Title</label>
            <input class='title-input'>
            <label class='url-label'>Url</label>
            <input class='url-input'>
            <button class='link-add-btn'>Add</button>
          </div>
          <div class='sort-options'>
            <h3>Sort</h3>
            <div class='radio-buttons'>
              <label>Recently Added<input type='radio' name='sort'></label>
              <label>Most Popular <input type='radio' name='sort'></label>
            </div>
          </div>
        </div>
        <div class='links-container'>
          <h5>links listsed here</h5>
        </div>
      </section>
    </article>
    `
  )
}

function insertRoomSettingsHtml()
{


    roomSettingsPage.innerHTML =
        `
    <article>
  
    <div class="positioning">
    <div class="container">

        <div class="container__create-container">
            <div class="container__room-id-output"></div>
            <button class="container__create-room-id-button">create room</button>
        </div>
        <div class="container__join-container">
            <input type="text" class="container__room-id-input">
            <button class="container__join-room-id-button">join room</button>
        </div>

        <div class="container__account-container">
            <div class="container__sign-in"></div>
            <div class="container__sign-out">sign out</div>

        </div>



    </div>
    </div>
</article>
    `

    cssLink.href = "/roomSettingsFiles/css/style.css"
    // loadJsDynamically("/socket.io/socket.io.js")
    // loadJsDynamically("/roomSettingsFiles/js/socket.js")
    // loadJsDynamically("/roomSettingsFiles/js/variables.js")
    // loadJsDynamically("/roomSettingsFiles/js/insertHtml.js")
    // loadJsDynamically("/roomSettingsFiles/js/addEventListeners.js")
    // loadJsDynamically("/roomSettingsFiles/js/initialize.js")
    // loadJsDynamically("/roomSettingsFiles/js/index.js")
    // loadJsDynamically("/roomSettingsFiles/js/jwt-decode.js")
    // loadJsDynamically("/roomSettingsFiles/js/googleAuthorization.js")
    initializeRoomSettingsPageAllThings()

}



function insertStatsHtml(payload)
{
    let htmlData = ""
    let innerHtmlData = ""
    for (let i = 0; i < 2; i++)
    {

        for (let j = 0; j < payload.games[i].playersDetails.length; j++)
        {
            innerHtmlData += `  
                        <div class="inner-row">

                                <span class="inner-column">${payload.games[i].playersDetails[j].playerNumber}</span>
                                <span class="inner-column">${payload.games[i].playersDetails[j].name}</span>
                                <span class="inner-column">${payload.games[i].playersDetails[j].score}</span>
                                <span class="inner-column">5 min</span>
        
        
        
                </div>`
        }
        htmlData += ` 

<div class="toc__row${1} row">

        <span class="toc__row${1}-column1 column">21 july</span>
        <span class="toc__row${1}-column2 column">7:40 pm Ist</span>
        <span class="toc__row${1}-column3 column">single player</span>
        <span class="toc__row${1}-column4 column">aakash</span>

        <!-- i-h-r = inner-heading-row -->
        <div class="row${1}__i-h-r i-h-r">

                <!-- i-h-c = inner-heading-column -->
                <span class="i-h-c">player number</span>
                <span class="i-h-c">player name</span>
                <span class="i-h-c">score</span>
                <span class="i-h-c">time</span>


        </div>
        <div class="row${i}__i-d-c">
        ${innerHtmlData}
        </div>
</div>
`
    }


    statsPage.innerHTML =
        `  
                
                <article>
                        <div class="tables-container">


                                <section>
                                        <!-- tac = table-one-container -->
                                        <div class="toc">

                                        <div class="toc_heading-row heading-row">

                                        <!-- hr1c1 = heading-row1-column1 -->
                                        <span class="toc__hr1c1 heading-column">Date</span>
                                        <span class="toc__hr1c2 heading-column">time</span>
                                        <span class="toc__hr1c3 heading-column">matchType</span>
                                        <span class="toc__hr1c4 heading-column">winner</span>
                                
                                </div>
                                
                                ${htmlData}


                                        </div>
                                </section>
                        </div>

                </article>
        
        
       
`

    cssLink.href = "/statsFiles/css/stats.css"

    pageHistory.currentPage.style.display = "none"
    pageHistory.currentPage = document.querySelector(".stats-page")
    pageHistory.optionsClicked[2] = true

}
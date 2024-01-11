
function addHomeOptionEventListeners()
{
    homeOption.addEventListener("click", () =>
    {
        navBar.style.display = "none"
        pageHistory.currentPage.style.opacity = "1"
        transitionUpward()
        setTimeout(() =>
        {

            pageHistory.currentPage.style.display = "none"
            pageHistory.currentPage = document.querySelector(".home-page")
            pageHistory.currentPage.style.display = "block"
            cssLink.href = "/indexFiles/css/style.css"
        }, 500)
        setTimeout(transitionClose, 2000)
    })
}



function addPlayOptionEventListeners()
{
    playOption.addEventListener("click", () =>
    {

        navBar.style.display = "none"
        pageHistory.currentPage.style.opacity = "1"
        transitionUpward()
        setTimeout(() =>
        {

            if (!pageHistory.optionsClicked[1])
            {

                insertRoomSettingsHtml()
                pageHistory.currentPage.style.display = "none"
                pageHistory.currentPage = document.querySelector(".room-settings-page")
                pageHistory.currentPage.style.display = "block"
                pageHistory.currentPlayPage = pageHistory.currentPage
                pageHistory.optionsClicked[1] = true
                pageHistory.currentPlayPageCssFilePath = "/roomSettingsFiles/css/style.css"
            }
            else
            {

                pageHistory.currentPage.style.display = "none"
                pageHistory.currentPlayPage.style.display = "block"
                cssLink.href = pageHistory.currentPlayPageCssFilePath
                pageHistory.currentPage = pageHistory.currentPlayPage


            }
        }, 500)
        setTimeout(transitionClose, 2000)
    })
}

function addStatsOptionEventListeners()
{
    statsOption.addEventListener("click", () =>
    {

        navBar.style.display = "none"
        pageHistory.currentPage.style.opacity = "1"
        transitionUpward()
        setTimeout(() =>
        {

            if (!pageHistory.optionsClicked[2])
            {

                socket.emit("retrieve stats data", userProfileInformation.googleId)

            }
            else
            {

                pageHistory.currentPage.style.display = "none"
                pageHistory.currentPage = document.querySelector(".stats-page")
                pageHistory.currentPage.style.display = "block"
                cssLink.href = "/statsFiles/css/stats.css"
                setTimeout(transitionClose, 2000)
            }
        }, 500)

    })
}

function addInstructionsOptionEventListeners()
{
    instructionsOption.addEventListener("click", () =>
    {
        if (!clickedButtons[3])
        {
            insertHowToPlayHtml()
        }
        else
        {
            currentPage.style.display = "none"
            currentPage = document.querySelector(".three")
            currentPage.style.display = "block"
        }
    })
}


function addBodyEventListeners()
{
    body.addEventListener("keydown", (e) =>
    {
        if (e.key == "Escape")
        {
            if (navBar.style.display == "flex")
            {
                navBar.style.display = "none"
                pageHistory.currentPage.style.opacity = "1"
            }
            else
            {
                navBar.style.display = "flex"
                pageHistory.currentPage.style.opacity = "0.8"
            }

        }
    })
}
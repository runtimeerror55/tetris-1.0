
function transitionUpward()
{

    loaderToggleClass(loader, "loader-active1")
    setTimeout(() =>
    {
        loaderToggleClass(loaderSvg, "loader-svg-active1")
    }, 500)

}

function transitionClose()
{

    loaderToggleClass(loader, "loader-active1");
    loaderToggleClass(loaderSvg, "loader-svg-active1");
    loaderToggleClass(navBar, "nav-bar-active1")
}



function loaderToggleClass(element, className)
{
    element.classList.toggle(className)
}


// addGetStartedButtonEventListeners()
addPlayOptionEventListeners()
addHomeOptionEventListeners()
addInstructionsOptionEventListeners()
addStatsOptionEventListeners()
addBodyEventListeners()
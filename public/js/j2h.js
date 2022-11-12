const j2h = {
    toggleVisibility: function(el, name) {
        j2h.toggleClass(el.parentElement,'j2hcollapse j2hexpand') ;
    },
    classRe: function(name) {
        return new RegExp('(?:^|\\s)'+name+'(?!\\S)') ;
    },
    addClass: function(el, name) {
        el.className += " "+name;
    },
    removeClass: function(el, name) {
        el.className  = el.className.replace( j2h.classRe(name) , '' )
    },
    hasClass: function(el, name) {
        return j2h.classRe(name).exec(el.className);
    },
    toggleClass: function(el, name) {
        var names = name.split(/\s+/) ;
        for (let n in names) {
            if (j2h.hasClass(el, names[n])) {
                j2h.removeClass(el, names[n]) ;
            } else {
                j2h.addClass(el, names[n]) ;
            }
        }
    }
};
function genValue(){
    return Math.floor(Math.random() * (55 - (-55))) + (-55) 
}

var xz=[[
    genValue() 
],
[
    genValue() 
]]

var bro1xz=[
    genValue()
,
    genValue() 
]

var bro2xz=[
    genValue() 
,
    genValue() 
]

var bro3xz=[
    genValue() 
,
    genValue() 
]

function refreshBrochure(){
    bro1xz=[
        genValue()
    ,
        genValue() 
    ]
    
    bro2xz=[
        genValue() 
    ,
        genValue() 
    ]
    
    bro3xz=[
        genValue() 
    ,
        genValue() 
    ]
}
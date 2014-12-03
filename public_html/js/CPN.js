/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var TEXT = ""  ; // colorset
var INT  = 0   ; // colorset
var REAL = 0.0 ; // colorset

// Lugar .....: id  , nome  , cor         , inicial      , tokens    ;
// Transição .: id  , nome  , habilitador , temporizador , ação      ;
// Arco ......: id  , lugar , transição   , direção      , expressão ;
// Token .....: cor , valor , tempo ;

// Observação : Os tokens devem ser FINAL (não podem mudar o valor do token);



var CpnPlace = function ()
{
    Place.apply( this , arguments );
};

CpnPlace.prototype = Place.prototype;
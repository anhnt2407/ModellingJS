var ITEM_COUNTER      = 0 ;

var PlaceToTransition = 0 ;
var TransitionToPlace = 1 ;

function getItemId()
{
    return ++ITEM_COUNTER; 
};

var PetriNet = function ()
{
    this.arcs        = new Array();
    this.places      = new Array();
    this.transitions = new Array();
    
    // --------------------------------- //
    
    String.prototype.getName   = function (){ return this.substring( 0 , this.indexOf( "(" ) ); };
    String.prototype.getNumber = function (){ return parseInt( this.substring( this.indexOf( "(" ) + 1 , this.indexOf( ")" ) ) ); };
    String.prototype.getValue  = function (){ return this.length === 1 ? 1 : parseInt( this.substring( 0 , this.length - 1 ) ); };
    
    // --------------------------------- //
    
    this.addArc = function ( obj1 , obj2 , value )
    {
        if( typeof obj1 === "string" )
        {
            try
            {
                var place = this.getPlaceWithName     ( obj1 );
                var trans = this.getTransitionWithName( obj2 );
                var direc = PlaceToTransition;

                return this.arcs.push( new Arc( place , trans , direc , value ) );
            }
            catch ( err )
            {
                var place = this.getPlaceWithName     ( obj2 );
                var trans = this.getTransitionWithName( obj1 );
                var direc = TransitionToPlace;

                return this.arcs.push( new Arc( place , trans , direc , value ) );
            }
        }
        else if( typeof obj1 === "object" )
        {
            return this.arcs.push( obj1 );
        }
    };
    
    this.addPlace = function ( obj , number )
    {
        if( typeof obj === "string" )
        {
            return this.places.push( new Place( obj , number ) );
        }
        else if( typeof obj === "object" )
        {
            return this.places.push( obj );
        }
    };
    
    this.addTransition = function ( obj )
    {
        if( typeof obj === "string" )
        {
            return this.transitions.push( new Transition( obj ) );
        }
        else if( typeof obj === "object" )
        {
            return this.transitions.push( obj );
        }
    };
    
    // --------------------------------- //
    
    this.create = function ( path )
    {
        // clear all double espace
        while( path.indexOf( "  " ) !== -1 )
        {
            path.replace( "  " , " " );
        }
        
        // split in n parts
        var paths = path.split( " " );
        
        // create all places and transitions
        for( var i = 0 ; i < paths.length ; i++ )
        {
            var item = paths[ i ];
            
            if( item.indexOf( ">" ) !== -1 )
            {
                continue ;
            }
            else if( item.indexOf( "(" ) !== -1 )
            {
                try
                {
                    this.getPlaceWithName( item.getName() );
                }
                catch( err )
                {
                    this.addPlace( item.getName() , item.getNumber() );
                }
            }
            else
            {
                try
                {
                    this.getTransitionWithName( item );
                }
                catch( err )
                {
                    this.addTransition( item );
                }
            }
        }
        
        // create all arcs
        for( var i = 0 ; i < paths.length ; i++ )
        {
            var item = paths[ i ];
            
            if( item.indexOf( ">" ) !== -1 )
            {
                var obj1 = paths[ i - 1 ];
                var obj2 = paths[ i + 1 ];
                var value = item.getValue();
                
                if( obj1.indexOf( "(" ) !== -1 )
                {
                    obj1 = obj1.getName();
                }
                else
                {
                    obj2 = obj2.getName();
                }
                
                this.addArc( obj1 , obj2 , value );
            }
        }
    };
    
    // --------------------------------- //
    
    this.getPlaceWithName = function ( name )
    {
        for( var i = 0 ; i < this.places.length ; i++ )
        {
            var place = this.places[ i ];
            if( place.name === name )
            {
                return place;
            }
        }
        
        throw "There is no place with name " + name;
    };
    
    this.getTransitionWithName = function ( name )
    {
        for( var i = 0 ; i < this.transitions.length ; i++ )
        {
            var trans = this.transitions[ i ];
            if( trans.name === name )
            {
                return trans;
            }
        }
        
        throw "There is no transition with name " + name;
    };
    
    this.start = function ( initialToken )
    {
        console.log( "Start Petri Net..." );
        
        console.log( "Clear places..." );
        for( var i = 0 ; i < this.places.length ; i++ )
        {
            this.places[ i ].arcOuts = new Array();
            
            if( initialToken )
            {
                this.places[ i ].tokens  = this.places[ i ].initial;
            }
        }
        
        console.log( "Clear transitions..." );
        for( var i = 0 ; i < this.transitions.length ; i++ )
        {
            this.transitions[ i ].arcOuts = new Array();
            this.transitions[ i ].arcIns  = new Array();
        }
        
        console.log( "Reorgenize arcs..." );
        for( var i = 0 ; i < this.arcs.length ; i++ )
        {
            var arc = this.arcs[ i ];
            
            if( typeof arc.place === "string" )
            {
                arc.place = this.getPlaceWithName( arc.place );
            }
            
            if( typeof arc.transition === "string" )
            {
                arc.transition = this.getTransitionWithName( arc.transition );
            }
            
            if( arc.direction === PlaceToTransition )
            {
                arc.place     .arcOuts.push( arc );
                arc.transition.arcIns .push( arc );
            }
            else
            {
                arc.transition.arcOuts.push( arc );
            }
        }
    };
    
    this.getTransitionTriggerable = function ()
    {
        var triggerable = new Array();
        
        for( var i = 0 ; i < this.transitions.length ; i++ )
        {
            var trans = this.transitions[ i ];
            
            if( trans.isTriggerable() )
            {
                triggerable.push( trans );
            }
        }
        
        return triggerable;
    };
    
    this.fire = function ( quant )
    {
        if( typeof quant !== "number" )
        {
            this.fireOneTime();
        }
        else
        {
            for( var i = 0 ; i < quant ; i++ )
            {
                this.fireOneTime();
            }
        }
    };
    
    this.fireOneTime = function ()
    {
        var list  = this.getTransitionTriggerable();
        var trans = this.getRandom( list );
        
        if( typeof trans !== "object" )
        {
            throw "There is no transition triggerable.";
        }
        
        trans.fired();
    };
    
    this.getRandom = function ( list )
    {
        var index = Math.floor((Math.random() * list.length) + 0);
        
        return list[ index ];
    };
    
};

// -------------------------- // Define

var Arc = function ( p , t , d , v )
{
    this.id         = getItemId();
    this.place      = p ;
    this.transition = t ;
    this.direction  = isNaN( d ) ? PlaceToTransition : d ;
    this.value      = isNaN( v ) ? 1 : v ;
};

var Place = function ( name , initial )
{
    this.id         = getItemId() ;
    this.name       = name ;
    this.initial    = isNaN( initial ) ? 0 : initial ;
    
    this.tokens     = 0;           // Simulation
    this.arcOuts    = new Array();
};

var Transition = function ( name )
{
    this.id         = getItemId() ;
    this.name       = name        ;
    
    this.arcOuts    = new Array() ; // Simulation
    this.arcIns     = new Array() ; // Simulation
    
    this.fired = function ()
    {
        if( !this.isTriggerable() )
        {
            throw "This transition cannot be fired.";
        }
        
        console.log( "Transition " + this.name + " was fired." );
        
        // retira os tokens dos lugares de entrada
        for( var i = 0 ; i < this.arcIns.length ; i++ )
        {
            var arc = this.arcIns[ i ];
            arc.place.tokens -= arc.value;  // remove tokens
        }
        
        // acrescenta os tokens dos lugares de saída
        for( var i = 0 ; i < this.arcOuts.length ; i++ )
        {
            var arc = this.arcOuts[ i ];
            arc.place.tokens += arc.value;  // add tokens
        }
    };
    
    this.isTriggerable = function ()
    {
        for( var i = 0 ; i < this.arcIns.length ; i++ )
        {
            var arc = this.arcIns[ i ];
            
            if( arc.value > arc.place.tokens )
            {
                return false ;
            }
        }
        
        return true;
    };
    
};
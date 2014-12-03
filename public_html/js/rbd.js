
var exponencial = function ( time )
            {
                var l = null;

                if( typeof this.lamina !== 'undefined' )
                {
                    l = this.lamina;
                }
                else if( typeof this.MTTF !== 'undefined' )
                {
                    l = 1 / this.MTTF;
                }
                else
                {
                    throw "It is necessary define MTTF or lamina property.";
                }

                return Math.pow( Math.E , -l * time );
            };

// ------------------------------------------------ //

var RBD = {
            distDefault : exponencial
          };

var SetOfBlock = function( blck )
            {
                this.blocks = new Array();
                
                this._construct = function ( blck )
                {
                    this.add( blck );
                };
                
                this.add = function ( blck )
                        {
                            if( typeof blck === 'undefined' 
                                    || typeof blck === 'null' )
                            {
                                // do nothing
                            }
                            else if( typeof blck.length === 'number' )
                            {
                                for( var i = 0 ; i < blck.length ; i++ )
                                {
                                    this._addOneBlock( blck[ i ] );
                                }
                                
                                // do nothing
                            }
                            else if( typeof blck === 'object' )
                            {
                                this._addOneBlock( blck );
                            }
                        };
                        
                this._addOneBlock = function ( blck )
                        {
                            if( typeof blck.evaluate === 'undefined' )
                            {
                                blck.evaluate = RBD.distDefault;
                            }

                            this.blocks.push( blck );
                        };
                          
                this.remove = function ( index )
                        {
                            this.blocks.splice( index , 1 );
                        };
                
                this.evaluate = function( time )
                        { return 0; };
                
                // ----------- constructor
                
                this._construct( blck );
            };

// ------------------------------------------------ // SERIES

var Series = function()
            {
                SetOfBlock.apply( this , arguments );
                
                this.evaluate = function( time )
                        {
                            var i     = 0 ;
                            var total = 1 ;

                            for( i = 0 ; i < this.blocks.length ; i++  )
                            {
                                total *= this.blocks[ i ].evaluate( time );
                            }

                            return total ;
                        };
            };

Series.prototype = SetOfBlock.prototype; // extends SetOfBlock's




// ------------------------------------------------ // PARALLEL

var Parallel = function()
            {
                SetOfBlock.apply( this , arguments );
                
                this.evaluate = function( time )
                        {
                            var i     = 0 ;
                            var total = 1 ;

                            for( i = 0 ; i < this.blocks.length ; i++  )
                            {
                                total *= (1 - this.blocks[ i ].evaluate( time ));
                            }

                            return 1 - total;
                        };
            };

Parallel.prototype = SetOfBlock.prototype;  // extends SetOfBlock's




// ------------------------------------------------ // K Out Of N

var KOutOfN = function()
            {
                SetOfBlock.apply( this , arguments );
                
                this.evaluate = function( time )
                        {
                            //TODO: como calcular?
                            return 0;
                        };
            };

KOutOfN.prototype = SetOfBlock.prototype;  // extends SetOfBlock's





// ------------------------------------------------ // K Out Of N

var Brigde = function()
            {
                SetOfBlock.apply( this , arguments );
                
                this.evaluate = function( time )
                        {
                            //TODO: como calcular?
                            return 0;
                        };
            };

Brigde.prototype = SetOfBlock.prototype;  // extends SetOfBlock's


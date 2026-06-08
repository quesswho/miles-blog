# Liquid 4.0.3 calls tainted? which was removed in Ruby 3.2.
require 'liquid'

module Liquid
  class Variable
    def taint_check(_context, _obj); end
  end
end

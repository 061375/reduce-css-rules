<?php
$i = new reduce();
/***
 *
 *
 * */
class reduce {
    
    // @param array
    private $errors;
    
    // @param string
    private $dir = '/sheets/';
    
    function __construct() {
        // intialize
        
        $method = isset($_POST['method']) ? $_POST['method'] : false;
        if(false === $method) {
            $this->render(false,array('method is a required field'));   
        }
        //
        if(false === method_exists($this,$method)) {
            $this->render(false,array('method does not exist')); 
        }
        //
        $data = isset($_POST['data']) ? $_POST['data'] : false;
        if(false === $data) {
            $this->render(false,array('data is a required field')); 
        }
        
        // set the full path to the write directory
        $this->dir = getcwd().$this->dir;
        
        // run method
        $result = $this->$method($data);
        if(false === $result) {
            $this->render(false,$this->getErrors()); 
        }
        
        $this->render(true,$result);
    }
    /**
     * getStyle
     * @param array $data
     * @return array
     * */
    function getStyle($data) {
        if(false === isset($data['domain'])) {
            $this->setErrors('domain is a required field');
            return false;
        }
        $datafile = $this->dir.$data['domain'].'/.data';
        if(false == file_exists($datafile)) {
            // return an empty string and the js program will create a new one
            return '';
        }
        return json_decode(file_get_contents($datafile));
    }
    /**
     * setStyle
     * @param array $data
     * @return boolean
     * */
    function setStyle($data) {
        $domain = $this->dir.$this->_isset($data,'domain','domain is a required field',true);
        $sheet = $this->_isset($data,'sheet','sheet is a required field',true);
        $json = $this->_isset($data,'json','json is a required field',true);
        if(true === $this->hasErrors()) {
            return false;
        }
        if(false == is_dir($domain)) {
            $result = mkdir($domain);
            if(false === $result) {
                $this->setErrors('an error occured writing file. Make sure you have permission to write');
                return false;
            }
        }
        $result = file_put_contents($domain.'/.data',json_encode($data));
        if(false === $result) {
            $this->setErrors('an error occured writing data file. Make sure you have permission to write');
            return false;
        }
        $result = file_put_contents($domain.'/style.css',$sheet);
        if(false === $result) {
            $this->setErrors('an error occured writing style.css. Make sure you have permission to write');
            return false;
        }
        return 'The stylesheet and data was successfully written';
    }
    /**
     * _isset
     * @param array
     * @param string
     * @param variant
     * @param boolean
     * @return variant
     * */
    function _isset($array,$key,$else=false,$error=false) {
        $result = isset($array[$key]) ? $array[$key] : $else;
        if(true === $error AND false == isset($array[$key])) {
            $this->setErrors($else);
            return false;
        }
        return $result;
    }
    /**
     * setErrors
     * @param string
     * @return void
     * */
    function setErrors($m) {
        $this->errors[] = $m;
    }
    /**
     * getErrors
     * @return array
     * */
    function getErrors() {
        return $this->errors;
    }
    /**
     * hasErrors
     * @return boolean
     * */
    function hasErrors() {
        if(count($this->errors) > 0) {
            return true;
        }
        return false;
    }
    /**
     * render
     * renders the jason response
     * @param boolean
     * @param array
     * @return void
     * */
    function render($success,$message) {
        header('Content-type:application/json');
        echo json_encode(array(
            'success'=>$success,
            'message'=>$message
        ));
        die(); 
    }
}
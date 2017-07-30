<!doctype html>

<html lang="en">
<head>
    <title><!-- Insert your title here --></title>
    
    <link rel="stylesheet" href="_/css/style.css?a=<?php echo strtotime('now'); ?>" />
</head>
<body>
    <div class="container pageone">
        <h1>
            This Is Page One
        </h1>
        <p>
            <a href="page2.php">Go to Page Two</a> -->
        </p>
        <table>
            <tr>
                <td class="blue">
                    <h2>
                        This is a test
                    </h2>
                </td>
                <td class="yellow">
                    <p>
                        This is a test
                    </p>
                </td>
            </tr>
            <tr>
                <td class="red">
                    <p>
                        <a href="#">This is a test</a>
                    </p>
                </td>
                <td class="green">
                    <p>
                        <a href="#">Green</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
    <?php if('192.168.1.157' == $_SERVER['REMOTE_ADDR']) {?><script src="http://192.168.1.154:35729/livereload.js"></script><?php } ?>
</body>
<script>
    var overideReduce = {useajax: true};
</script>
<script src="_/components/js/script.js?a=<?php echo strtotime('now'); ?>"></script>
</html>

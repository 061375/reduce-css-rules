<!doctype html>

<html lang="en">
<head>
    <title><!-- Insert your title here --></title>
    <script src="_/components/js/script.js?a=<?php echo strtotime('now'); ?>"></script>
    <link rel="stylesheet" href="_/css/style.css?a=<?php echo strtotime('now'); ?>" />
</head>
<body>
    <div class="container pagetwo">
        <h1>
            This Is Page Two
        </h1>
        <p>
            <--- <a href="index.php">Go to Page One</a> &nbsp; <a href="page3.php">Go to Page Three</a> --->
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
                <td class="purple">
                    <p>
                        <a href="#">Purple</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
    <?php if('192.168.1.157' == $_SERVER['REMOTE_ADDR']) {?><script src="http://192.168.1.154:35729/livereload.js"></script><?php } ?>
</body>
</html>
